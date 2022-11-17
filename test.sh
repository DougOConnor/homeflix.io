rm data/*
nohup sh startup.sh > output.log &

cd client
nohup npm start > output2.log &

sleep 5

export SCREEN_WIDTH=1920
export SCREEN_HEIGHT=1080
npm run test src/tests/e2e/*.test.js 

sleep 2

killall -9 node