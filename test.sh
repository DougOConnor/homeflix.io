docker compose up --detach --build

cd tests

pip install -r requirements.txt
python -m pytest

docker compose down