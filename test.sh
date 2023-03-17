docker compose up --detach --build

source env/bin/activate
pip install -r tests/requirements.txt
python -m pytest

#docker compose down