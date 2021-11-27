FROM node:alpine
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN \
    apk add --update git python3 py3-pip

RUN apk add ffmpeg
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build:prod
CMD [ "node","./build/src/index.js"]
