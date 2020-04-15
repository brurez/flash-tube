#!/bin/bash

docker build -t brurez/flash-tube-client:latest -t brurez/flash-tube-client:"$SHA" -f ./client/Dockerfile ./client
docker build -t brurez/flash-tube-server:latest -t brurez/flash-tube-server:"$SHA" -f ./server/Dockerfile ./server

docker push brurez/flash-tube-client:latest
docker push brurez/flash-tube-server:latest

docker push brurez/flash-tube-client:"$SHA"
docker push brurez/flash-tube-server:"$SHA"

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=brurez/flash-tube-client:"$SHA"
kubectl set image deployments/server-deployment server=brurez/flash-tube-server:"$SHA"
