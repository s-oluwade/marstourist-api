#!/bin/bash
docker build -t marstourist-api .
docker tag marstourist-api:latest webappsandapis.azurecr.io/marstourist-api:latest
az acr login --name webappsandapis
docker push webappsandapis.azurecr.io/marstourist-api:latest