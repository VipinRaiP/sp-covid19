FROM ubuntu:latest
MAINTAINER Harshabh

RUN apt-get update
RUN apt install curl -y
# RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install nodejs -y
RUN apt install npm -y
#RUN npm install forever
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

CMD ["node","server.js","&"]
CMD ["/usr/sbin/apache2","-D","FOREGROUND"]
EXPOSE 80