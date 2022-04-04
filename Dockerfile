FROM node:alpine
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN \
    apk update && \
    apk add --no-cache --virtual .gyp && \
    apk add --no-cache --update g++ make ffmpeg librsvg-dev python3 py3-pip  build-base cairo-dev jpeg-dev pango-dev giflib-dev && \
    pip install --upgrade pip
WORKDIR /app
COPY . /app/
RUN npm install --build-from-resource
RUN npm run generate
RUN npm run build:prod
EXPOSE 3001
CMD [ "node","./build/src/web/server.js"]