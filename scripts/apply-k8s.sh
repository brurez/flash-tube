kubectl apply -f k8s
kubectl set image deployments/client-deployment client=brurez/flash-client:"$SHA"
kubectl set image deployments/server-deployment server=brurez/flash-server:"$SHA"
