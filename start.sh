#!/bin/bash

cd /src/build
pm2 start startproxy.js -i max
pm2 logs