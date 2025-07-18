```sh
cp .env.sample .env
docker compose build
docker compose run --rm server sh -c "go get app"
docker compose up server
```