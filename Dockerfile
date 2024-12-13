FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json for caching dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (only necessary if you're building for production)
CMD [ "npm", "run", "start:dev" ]
