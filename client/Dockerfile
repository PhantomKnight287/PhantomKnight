FROM ubuntu:21.10
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]