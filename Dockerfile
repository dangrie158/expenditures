from node:latest as frontend

WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json /frontend
RUN npm install --legacy-peer-deps
COPY frontend /frontend
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

from python:3.10

RUN apt update && apt install build-essential -y
RUN pip install poetry

RUN mkdir -p /usr/local/expenditures
WORKDIR /usr/local/expenditures
COPY ./backend /usr/local/expenditures/backend
COPY --from=frontend /frontend/build /usr/local/expenditures/frontend/build
RUN poetry install --directory backend

CMD poetry --directory backend run python backend/expenditures/server.py
