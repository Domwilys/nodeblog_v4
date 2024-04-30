FROM node:21.6.0
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8787
CMD ["npm", "start"]