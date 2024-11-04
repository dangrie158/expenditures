#!/bin/bash
set -e

poetry env use python
FLASK_ENV=development poetry run python -m expenditures &
P1=$!
cd frontend/
ionic serve --external &
P2=$!
trap 'kill $P1 $P2' EXIT
wait $P1 $P2
