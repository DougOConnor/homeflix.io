#rm data/*
#nohup sh startup.sh > output.log &

#cd client
#nohup npm start > output2.log &
#cd ..

#sleep 5

export SCREEN_WIDTH=1920
export SCREEN_HEIGHT=1080
#npm run test src/tests/e2e/01_FirstTimeSetup.test.js
#npm run test src/tests/e2e/02_AddShowing.test.js

#sleep 2

#killall -9 node

docker compose up --detach --build

cd tests

pip install -r requirements.txt
python -m pytest

docker compose down