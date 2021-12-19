FROM  alpine
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN \
    apk update &&\
    apk add --no-cache curl git npm ffmpeg python3 py3-pip nodejs-current && \
    pip install --upgrade pip
WORKDIR /app
COPY . /app/
RUN npm run generate
RUN npm install
RUN npm run build:prod
EXPOSE 3001
CMD [ "node","./build/src/web/server.js"]
