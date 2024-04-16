cd backend
npm i --include=dev
rm -rf build
npx tsc
cd ../frontend
npm i --include=dev
npm run build
cp -r build ../backend/build