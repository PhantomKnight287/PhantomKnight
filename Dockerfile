FROM ubuntu:20.04
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN \
    apt-get update &&\
    apt-get -y upgrade &&\
    apt-get install -y  curl git python3 python3-pip && \
    pip install --upgrade pip

RUN apt-get install -y ffmpeg
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs
EXPOSE 4000
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build:prod
CMD [ "node","./build/src/server.js"]
