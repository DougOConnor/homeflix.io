rm data/*
nohup sh startup.sh > output.log &

cd client
nohup npm start > output.log &

sleep 5

npm run test src/tests/e2e/*.test.js 

killall -9 node