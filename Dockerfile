from node:latest as frontend

WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json /frontend
RUN npm install
COPY frontend /frontend
RUN npm run build

from python:3.12

RUN apt update && apt install build-essential -y
RUN pip install poetry

RUN mkdir -p /usr/local/expenditures
WORKDIR /usr/local/expenditures
COPY ./backend /usr/local/expenditures/backend
COPY --from=frontend /frontend/build /usr/local/expenditures/frontend/build
RUN poetry install --directory backend

CMD poetry --directory backend run python backend/expenditures/server.py
