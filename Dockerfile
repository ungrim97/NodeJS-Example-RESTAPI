FROM node:lts-jessie

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
  && apt-get install -y mysql-client \
  && apt-get install -y libmysqlclient-dev \
  && apt-get clean \
&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN mkdir .nyc_output

EXPOSE 9000

CMD [ "npm", "run", "dev" ]
