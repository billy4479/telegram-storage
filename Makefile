GO ?= go

all: backend frontend

backend:
	mkdir -p build
	cd ./backend && \
	$(GO) build -o ../build/telegram-storage

backend-dev:
	CompileDaemon -build='make backend' -command='./build/telegram-storage'

frontend:
	mkdir -p build
	yarn --cwd frontend build --emptyOutDir

frontend-dev:
	yarn  --cwd frontend dev --host

.PHONY: all backend backend-dev frontend frontend-dev
