# /bin/sh
# 配置文件
echo "VITE_APP_VERSION=${GIT_TAG}" > .env
# Build
npm config set registry https://registry.npmmirror.com
npm ci
# npm install --omit=optional
npm run build

if [ $? -eq 0 ]; then
  echo "Build Success!"
else 
  echo "Build failed!"
  exit 1
fi

mkdir -p /dist
cp -r /drone/src/dist/* /dist