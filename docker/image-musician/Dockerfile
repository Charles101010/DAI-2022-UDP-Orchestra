FROM node:latest

COPY src/* /var/opt/
WORKDIR /var/opt
RUN npm install

ENTRYPOINT ["node", "index.js"]