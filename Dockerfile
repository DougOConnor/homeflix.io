FROM node:16

ADD api /api
ADD client /client
ADD config /config
ADD models /models
ADD utils /utils
ADD install.sh /install.sh
ADD package.json /package.json
ADD package-lock.json /package-lock.json
ADD server.js /server.js
ADD startup.sh /startup.sh
ADD migrations /migrations
ADD seeders /seeders


RUN sh /install.sh

CMD ["sh", "/startup.sh"]