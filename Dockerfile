FROM node:16.0.0

WORKDIR "/app"

COPY ./package.json ./

RUN npm install -force

COPY . .

CMD [ "npm", "run", "start-prod" ]
