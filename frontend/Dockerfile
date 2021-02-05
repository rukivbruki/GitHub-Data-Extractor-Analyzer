FROM node:12
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# package.json and package-lock.json

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "serve"]