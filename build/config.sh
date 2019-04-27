#!/bin/bash

cat <<EOF > /usr/share/nginx/html/uvcockpit/assets/config.json
{
    "uvtracks": {
        "protocol": "$UVTRACKS_PROTOCOL", 
        "hostname": "$UVTRACKS_HOSTNAME",
        "port": "$UVTRACKS_PORT"
    }
}
EOF
