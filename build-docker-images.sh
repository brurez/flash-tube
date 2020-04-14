docker build -t brurez/flash-client:latest -t brurez/flash-client:"$SHA" -f ./client/Dockerfile ./client
docker build -t brurez/flash-server:latest -t brurez/flash-server:"$SHA" -f ./server/Dockerfile ./server

docker push brurez/flash-client:latest
docker push brurez/flash-server:latest

docker push brurez/flash-client:"$SHA"
docker push brurez/flash-server:"$SHA"

