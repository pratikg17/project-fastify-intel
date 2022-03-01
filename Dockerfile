FROM node:14.5.0-alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
RUN npm install
COPY . .
CMD [ "npm", "run", "start-prod" ]