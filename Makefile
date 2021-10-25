GO ?= go

all: backend frontend

backend:
	mkdir -p build
	cd ./backend && \
	$(GO) build -o ../build/telegram-storage

backend-dev:
	CompileDaemon -build='make -C .. backend' -command='./build/telegram-storage' -directory=./backend

frontend:
	mkdir -p build
	yarn --cwd frontend build --emptyOutDir

frontend-dev:
	yarn  --cwd frontend dev --host

.PHONY: all backend backend-dev frontend frontend-dev
