FROM node:8
LABEL Author="Charles Stover"
ENV PORT=8080
RUN apt-get update && apt-get install -y bluetooth bluez libbluetooth-dev libudev-dev
WORKDIR /var/www
COPY package*.json /var/www/
RUN npm install
COPY . /var/www/
EXPOSE ${PORT}
CMD [ "node", "index.js" ]
