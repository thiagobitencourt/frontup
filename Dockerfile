#Dockerfile api
FROM node:6.7.0

ENV HOME=/usr/src/frontup

WORKDIR $HOME

ADD package.json package.json
ADD bower.json bower.json
RUN npm install
RUN bower install --allow-root
ADD . .

EXPOSE 8080

CMD ["node","app.js"]
