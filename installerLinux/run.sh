#!/bin/sh
trap 'kill $(jobs -p)' EXIT
./node/bin/node ./bin/www &
sleep 3
xdg-open localhost:3000 
