FROM  ubuntu:14.04

RUN   apt-get -y update
RUN   curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN   apt-get install -y nodejs

ADD   . /src/build

RUN   cd /src/build && npm install --production

CMD   npm start /src/build
