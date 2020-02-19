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
