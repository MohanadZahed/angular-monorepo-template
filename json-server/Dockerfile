FROM node:18-alpine

WORKDIR /app

RUN npm install -g json-server

EXPOSE 3000

CMD ["json-server", "--watch", "config.json", "--port", "3000", "--host", "0.0.0.0"]