import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/plugins/json-tool/model/history-item';

const DB_NAME = 'json-formatter-db';
const STORE_NAME = 'history';
const DB_VERSION = 1;
const MAX_HISTORY_ITEMS = 50;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function getAllHistory(): Promise<HistoryItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev');
    const items: HistoryItem[] = [];

    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else {
        resolve(items);
      }
    };
  });
}

async function addHistoryItem(item: HistoryItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(item);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function deleteHistoryItem(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function clearAllHistory(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

function createPreview(content: string): string {
  try {
    const parsed = JSON.parse(content);
    const formatted = JSON.stringify(parsed, null, 2);
    return formatted.substring(0, 200);
  } catch {
    return content.substring(0, 200);
  }
}

export function useJsonHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getAllHistory()
      .then((items) => {
        setHistory(items);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load history:', error);
        setIsLoaded(true);
      });
  }, []);

  const addToHistory = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      const isDuplicate = history.some((item) => item.content == content);
      if (isDuplicate) return;

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        content,
        timestamp: Date.now(),
        preview: createPreview(content),
      };

      try {
        await addHistoryItem(newItem);
        setHistory((prev) => {
          const updated = [newItem, ...prev];
          if (updated.length > MAX_HISTORY_ITEMS) {
            const toRemove = updated.slice(MAX_HISTORY_ITEMS);
            toRemove.forEach((item) => deleteHistoryItem(item.id));
            return updated.slice(0, MAX_HISTORY_ITEMS);
          }
          return updated;
        });
      } catch (error) {
        console.error('Failed to add history item: ', error);
      }
    },
    [history],
  );

  const removeFromHistory = useCallback(async (id: string) => {
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete history item: ', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history: ', error);
    }
  }, []);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    return item.content;
  }, []);

  return {
    history,
    isLoaded,
    addToHistory,
    deleteHistoryItem: removeFromHistory,
    clearHistory,
    loadFromHistory,
  };
}
