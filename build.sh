docker build -t homeflix.io .
docker tag homeflix.io:beta douglasoconnor/homeflix.io:beta
docker push douglasoconnor/homeflix.io:beta