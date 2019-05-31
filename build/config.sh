#!/bin/bash
if [ -z "$UVTRACKS_PRIVATE_URL" ]; then
  export UVTRACKS_PRIVATE_URL="http://localhost:8080"
fi

cat <<EOF > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  root /usr/share/nginx/html;

  location /uvcockpit {
    index index.html;
    try_files \$uri \$uri/ /uvcockpit/index.html;
  }

  location /uvtracks {
    proxy_pass $UVTRACKS_PRIVATE_URL;
  } 
}
EOF