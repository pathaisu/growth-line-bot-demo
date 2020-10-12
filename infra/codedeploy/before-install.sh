
#!/bin/bash

if [ -d "/home/ec2-user/growth-line-bot" ]; then
    cd /home/ec2-user/growth-line-bot;

    /usr/local/bin/docker-compose down;
fi
