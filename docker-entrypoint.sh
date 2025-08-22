#!/bin/sh

# Replace PORT placeholder in nginx.conf with actual port
PORT="${PORT:-80}"
sed -i "s/\${PORT}/$PORT/g" /etc/nginx/nginx.conf

# Start nginx
exec nginx -g 'daemon off;'