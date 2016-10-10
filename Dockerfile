#Dockerfile api
FROM node:6.7.0

ENV HOME=/usr/src/frontup

WORKDIR $HOME

ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 9985

CMD ["node","app.js"]
