FROM node:6

RUN mkdir /app

WORKDIR /app

COPY package.json /app/

RUN npm install --production

COPY . /app

EXPOSE 443

CMD ["npm", "start"]