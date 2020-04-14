FROM node
WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
COPY . .
RUN yarn run build

CMD ["npm", "start"]
