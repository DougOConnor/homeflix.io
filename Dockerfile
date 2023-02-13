FROM node:16

ADD api /app/api
ADD client /app/client
ADD config /app/config
ADD models /app/models
ADD utils /app/utils
ADD install.sh /app/install.sh
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
ADD server.js /app/server.js
ADD startup.sh /app/startup.sh
ADD migrations /app/migrations
ADD seeders /app/seeders


RUN sh /app/install.sh

CMD ["sh", "/app/startup.sh"]