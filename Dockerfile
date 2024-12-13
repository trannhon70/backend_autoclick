FROM node:20-alpine

#Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

# install dependencies
RUN npm install

#copy the rest of the application

COPY . .

RUN npm run build