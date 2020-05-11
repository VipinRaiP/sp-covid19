#!/bin/sh

forever start server.js
/usr/sbin/apache2 -D FOREGROUND