# homeflix.io (UNDER DEVELOPMENT)
[![Release homeflix.io](https://github.com/DougOConnor/homeflix.io/actions/workflows/publish.yaml/badge.svg)](https://github.com/DougOConnor/homeflix.io/actions/workflows/publish.yaml)
[![Github Release](https://img.shields.io/github/v/tag/dougoconnor/homeflix.io?label=Github%20Release)](https://github.com/DougOConnor/homeflix.io)
[![Docker Release](https://img.shields.io/docker/v/douglasoconnor/homeflix.io?label=Docker%20Release)](https://hub.docker.com/repository/docker/douglasoconnor/homeflix.io)


homeflix.io is a web based application that allows home theater enthusiasts to host a booking portal for screenings at their home theater.
#
## Book Seats for Movie Night
Interactive seating chart for friends and family to login and book their seats for movie night
[![Checkout](https://d3n602puh8jcti.cloudfront.net/readme/checkout_screen.png)](https://github.com/DougOConnor/homeflix.io)

## Match Your Theater Layout
Completely customize homeflix.io with your exact home theater layout.
[![Layout](https://d3n602puh8jcti.cloudfront.net/readme/layout_editor.png)](https://github.com/DougOConnor/homeflix.io)


#
## Install
Currently, homeflix.io can only be run on Docker
```shell
docker run \
  -dit \
  --name=your_theater \
  -p 5000:5000 \
  -v /Path/to/your/data:/data \
  douglasoconnor/homeflix.io:beta
```
