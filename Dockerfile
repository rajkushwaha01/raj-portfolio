FROM nginx:latest

LABEL maintainer="raj(mailto:raj@gmail.com)"

WORKDIR /usr/share/nginx/html

COPY . .

EXPOSE 80
