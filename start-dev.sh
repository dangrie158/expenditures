#!/bin/bash
set -e

pushd backend/expenditures
poetry env use python
FLASK_ENV=development poetry run python server.py &
P1=$!
popd
pushd frontend/ && ionic serve --external &
P2=$!
popd
trap 'kill $P1 $P2' EXIT
wait $P1 $P2
