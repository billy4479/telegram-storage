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
	cd frontend && \
	yarn build --emptyOutDir

frontend-dev:
	cd frontend && \
	yarn dev --host

.PHONY: all backend backend-dev frontend frontend-dev
