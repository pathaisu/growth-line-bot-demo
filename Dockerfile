FROM node:14

WORKDIR /usr/src/app
ADD . /usr/src/app

EXPOSE 3001

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm run dev