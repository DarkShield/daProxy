# VERSION   0.2
# DOCKER-VERSION  0.4.0

from  ubuntu:12.04

run   echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
run   apt-get -y update

run   apt-get -y install wget git

run   apt-get -y install build-essential python
run   apt-get -y install libexpat1-dev libexpat1 libicu-dev

run   wget -O - http://nodejs.org/dist/v0.11.0/node-v0.11.0-linux-x64.tar.gz | tar -C /usr/local/ --strip-components=1 -zxv

ADD   . /src/build

ADD  ./hosts /etc/hosts

run   cd /src/build; npm install --production; npm test

EXPOSE 8080

CMD npm start /src/build && /src/build/node_modules/pm2/bin/pm2 logs