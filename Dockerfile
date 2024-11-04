FROM node:latest AS frontend

WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json /frontend
RUN npm install
COPY frontend /frontend
RUN npm run build

FROM python:3.12

RUN apt update && apt install build-essential -y
RUN pip install poetry

RUN mkdir -p /usr/local/expenditures
WORKDIR /usr/local/expenditures
COPY pyproject.toml poetry.lock /usr/local/expenditures/
RUN poetry install
COPY ./ /usr/local/expenditures/
COPY --from=frontend /frontend/build /usr/local/expenditures/frontend/build

CMD ["poetry", "run", "python", "-m", "expenditures"]
