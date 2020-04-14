#!/bin/bash

set -e

if [ -z "$KUBECONFIG" ]
then
    echo ${KUBERNETES_CA} | base64 --decode > flash-tube-ca.pem
    echo ${KUBERNETES_CLIENT_CA} | base64 --decode > flash-tube-client-ca.pem
    echo ${KUBERNETES_CLIENT_KEY} | base64 --decode > flash-tube-key.pem
    kubectl config set-cluster flash-tube --server=${KUBERNETES_ENDPOINT} --certificate-authority=flash-tube-ca.pem
    kubectl config set-credentials kubernetes-admin --client-certificate=flash-tube-client-ca.pem --client-key=flash-tube-key.pem
    kubectl config set-context kubernetes-admin@flash-tube --cluster=flash-tube --namespace=default --user=kubernetes-admin
    kubectl config use-context kubernetes-admin@flash-tube
fi

docker build -t brurez/flash-tube-client:latest -t brurez/flash-tube-client:"$SHA" -f ./client/Dockerfile ./client
docker build -t brurez/flash-tube-server:latest -t brurez/flash-tube-server:"$SHA" -f ./server/Dockerfile ./server

docker push brurez/flash-tube-client:latest
docker push brurez/flash-tube-server:latest

docker push brurez/flash-tube-client:"$SHA"
docker push brurez/flash-tube-server:"$SHA"

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=brurez/flash-tube-client:"$SHA"
kubectl set image deployments/server-deployment server=brurez/flash-tube-server:"$SHA"
