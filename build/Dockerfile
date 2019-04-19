FROM nginx

COPY ./dist /usr/share/nginx/html/
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY ./config.sh /usr/share/
RUN chmod 755 /usr/share/config.sh

CMD /usr/share/config.sh && nginx -g 'daemon off;'