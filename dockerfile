FROM ubuntu:latest
MAINTAINER Harshabh

RUN apt-get update
RUN apt install curl -y
# RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install nodejs -y
RUN apt install npm -y
RUN npm -g install forever deep-equal@1.1.1
RUN apt-get install -y apache2
RUN mkdir -p /var/lock/apache2
RUN mkdir -p /var/run/apache2
RUN mkdir /usr/backend
COPY backend /usr/backend


ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_LOG_DIR /var/log/apache2
ENV LANG C

COPY dist/sp-covid19 /var/www/html
 
WORKDIR /usr/backend

#RUN npm i
RUN chmod 777 script.sh
CMD ./script.sh
EXPOSE 80
EXPOSE 3000