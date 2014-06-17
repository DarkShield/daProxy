**Environments:**
```bash
NODE_ENV=development #connects to localhost vicetest db
NODE_ENV=test  #connects to remote mongo host using 'proxytest' db
NODE_ENV=production #connects to remote mongo host using 'vicetest' db
```

**To build and test from project root:**

```bash
docker build -t proxy .
docker run -d -e NODE_ENV=test -p 5555:8080 -dns 10.245.219.212 proxy #remove -d if you want to tail the logs
npm install jasmine-node
export NODE_ENV=test
./node_modules/jasmine-node/bin/jasmine-node ./docker-proxy.spec
```
**To run in production:**

```
docker run -d -e NODE_ENV=production -p 80:80 -dns 10.245.219.212 proxy
```

**The docker run command executes startproxy.js with pm2 in max mode. It creates a load balanced cluster with one process for each available CPU core. If you want to replicate this outside of docker just run 'npm start'.**


**CMD for registry**

```
cd /docker-registry && ./setup-configs.sh && ./run.sh
```


**Strider Custom Scripts**

***Test***
```bash
rm -rf ./node_modules
docker build -t proxy .
container=$(docker run -d -e NODE_ENV=test -p 5555:8080 -dns 10.245.219.212 proxy)
npm install request
jasmine-node docker-proxy.spec --captureExceptions
result=$?
docker stop $container

exit $result
```

***deploy***
```bash
#must have 127.0.0.1 darkdocker.darkshield.io in /etc/hosts

docker tag proxy darkdocker.darkshield.io:49154/proxy
docker push darkdocker.darkshield.io:49154/proxy
```

