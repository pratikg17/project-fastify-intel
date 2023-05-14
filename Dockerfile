FROM node:14.0.0

WORKDIR "/app"

COPY ./package.json ./

RUN npm install -f

COPY . .

CMD [ "npm", "run", "start-prod" ]
