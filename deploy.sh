cd backend
npm i --also=dev
rm -rf build
cd ../frontend
npm i --also=dev
npm run build
cp -r build ../backend/build