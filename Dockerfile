FROM node:20-alpine

# Cài đặt các gói cần thiết để Puppeteer hoạt động
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json for caching dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Đặt biến môi trường để Puppeteer tìm đúng trình duyệt
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Build the application (only necessary if you're building for production)
CMD [ "npm", "run", "start:dev" ]
