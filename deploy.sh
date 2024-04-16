cd backend
npm i --also=dev
cd ../frontend
npm i --also=dev
npm run build
mv build ../backend/build