# Telegram Storage API Documentation

## How it works

This project consists of four parts:

- [UI](../frontend) (written in Svelte)
- [API](../backend/api) (written in Go)
- [Telegram Bot](../backend/bot) (written in Go)
- Database (PostgreSQL)

## Get Started

First thing to do is populate the `.env` file. [An example is provided](.env.example).

The whole app is dockerized. To start the development environment with hot reloading of the frontend and backend code it's enough to run:

```sh
docker-compose up
```

A [Makefile](Makefile) is provided for convenience and was the default method before the app was dockerized, **it is not really supported now**.

## Individual components documentation

- [Login](login.md)