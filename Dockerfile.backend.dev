FROM golang:alpine

WORKDIR /app/backend

ENV GO111MODULE=on

RUN go install github.com/githubnemo/CompileDaemon@latest

ENTRYPOINT "CompileDaemon" "-build=go build -o ../telegram-storage" "-command=../telegram-storage"