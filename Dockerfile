FROM nginx

COPY ./dist /usr/share/nginx/html/
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf