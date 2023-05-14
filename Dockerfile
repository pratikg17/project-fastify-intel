FROM node:11.0.0

WORKDIR "/app"

COPY ./package.json ./

RUN npm install -force

COPY . .

CMD [ "npm", "run", "start-prod" ]
