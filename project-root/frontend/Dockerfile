FROM node:18-alpine AS build

WORKDIR /front_end_app

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


#STAGE 2
FROM node:18-alpine

WORKDIR /front_end_app

RUN npm install -g serve

COPY --from=build /front_end_app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

