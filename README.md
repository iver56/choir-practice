# What?

A web-app to help choir members practice their songs.

# How?

Backend: Django and PostgreSQL

Frontend: Vue.js, MidiConvert.js and Tone.js

# Setup (Docker)

* `docker build -t choir-practice .`
* `docker network create choir-practice-network`
* `docker run --network choir-practice-network -d -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=choir_practice --name choir_practice_database postgres:10-alpine`
* `docker run -it --entrypoint /bin/bash -v "$PWD":/mnt/choir_practice -w /mnt/choir_practice --network choir-practice-network -p 8000:8000 choir-practice:latest`
Note: You may have to replace "$PWD" with an absolute path to your local choir-practice directory (especially if you are running Windows). E.g. the command might look like this:
`docker run -it --rm --entrypoint /bin/bash -v C:/Users/Iver/Code/choir-practice:/mnt/choir_practice -w /mnt/choir_practice --network choir-practice-network -p 8000:8000 choir-practice:latest`
* Inside the docker container, run `python manage.py migrate`
* To spin up a web server with live-reload, run `python manage.py runserver 0.0.0.0:8000`
* Visit localhost:8000 in your browser

# Deploy production web server on a linux server

We suggest using nginx-proxy together with letsencrypt-nginx-proxy-companion for HTTPS. When you
are setting up the server for the first time, run the following commands (after replacing
email@example.org with your actual email address):

```
docker run --detach \
    --name nginx-proxy \
    --publish 80:80 \
    --publish 443:443 \
    --volume /etc/nginx/certs \
    --volume /etc/nginx/vhost.d \
    --volume /usr/share/nginx/html \
    --volume /var/run/docker.sock:/tmp/docker.sock:ro \
    --restart always \
    jwilder/nginx-proxy

docker run --detach \
    --name nginx-proxy-letsencrypt \
    --volumes-from nginx-proxy \
    --volume /var/run/docker.sock:/var/run/docker.sock:ro \
    --env "DEFAULT_EMAIL=email@example.org" \
    --restart always \
    jrcs/letsencrypt-nginx-proxy-companion
```

Build: `docker build -t choir-practice .`

Assuming you want to store all media on the host, at /root/choir-practice-media, the following
command shows how to run the docker image. Remember to replace both instances of example.org
with your actual domain!

```
docker stop choir-practice && docker rm choir-practice && docker run -d -p 80:80 \
    --network choir-practice-network -v /root/choir-practice-media:/usr/src/app/media \
    --env "VIRTUAL_HOST=example.org" \
    --env "LETSENCRYPT_HOST=example.org" \
    --restart always \
    --name="choir-practice" choir-practice
```

Now open your favorite browser and check if it works
