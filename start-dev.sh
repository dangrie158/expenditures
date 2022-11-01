#!/bin/bash

FLASK_ENV=development python3 server.py &
P1=$!
cd Expenditures && ionic serve --external &
P2=$!
trap 'kill $P1 $P2' EXIT
wait $P1 $P2
