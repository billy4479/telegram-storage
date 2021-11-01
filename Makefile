GO ?= go

all: backend frontend

backend:
	mkdir -p build
	cd ./backend && \
	$(GO) build -o ../build/telegram-storage

backend-dev:
	cd build && \
	CompileDaemon \
		-build='make -C .. backend' \
		-command='./telegram-storage -loadEnv ../.env' \
		-directory=../backend

frontend:
	mkdir -p build
	yarn --cwd frontend build --emptyOutDir

frontend-dev:
	yarn  --cwd frontend dev --host

docker:
	docker-compose -f docker-compose.prod.yml up --build

docker-dev:
	docker-compose up

docker-clean:
	docker-compose rm
	sudo rm -r ./db-data

.PHONY: all backend backend-dev frontend frontend-dev docker docker-dev docker-clean
