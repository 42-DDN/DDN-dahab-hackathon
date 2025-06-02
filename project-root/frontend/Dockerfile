FROM node:alpine

RUN npm install -g serve

WORKDIR /app

COPY build/ .

EXPOSE 5000

CMD ["serve", "-s", ".", "-l", "3000"]

