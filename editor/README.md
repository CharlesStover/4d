# 4D Editor

## Development Mode

To run this application with hot reloading for development purposes, use `npm start`.

## Build Static File

To compile this project into static files, use `npm run build`.

## Build Docker Image

To build a Docker image yourself, use `docker build --file Dockerfile --tag charlesstover/4d-editor .`.

## Download Docker Image

To download a pre-built Docker image, use `docker pull charlesstover/4d-editor`.

## Production Mode

To run a Docker container for production, use `docker run --detach --name 4d-editor --publish 80:80 charlesstover/4d-editor`.
