FROM nginx:1.17.8

COPY ./dist /usr/share/nginx/html/
COPY ./config.sh /usr/share/
RUN chmod 755 /usr/share/config.sh

CMD /usr/share/config.sh && nginx -g 'daemon off;'