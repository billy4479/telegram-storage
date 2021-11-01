# Telegram Storage

Store files in Telegram messages for free and access them in a nice web UI.

Telegram allows to store files (of max 2GB each) for a unlimited amount of storage.

This project allows you to store files in messages on a Telegram group and
access them in from a web UI with all the features you'd expect on a normal cloud storage service.

## How it works

This project consists of four parts:

- The UI (written in Svelte)
- The API (written in Go)
- The Telegram Bot (written in Go)
- The Database (PostgreSQL)

Users will have to start the bot, create a group, add the bot and make it administrator.

Typing `/link` will link the user to that group: the bot will send there all the files.

You will receive a token to login into the web UI, it will be your password
(It can be reset by using `/link` again).

Now you won't need Telegram anymore, everything is managed in the WebUI. 

Still, is not recommended to leave the group, since Telegram might not like the bot being alone in a group and could remove the messages
(I'm not sure about this statement but is better not to risk).

When files are deleted from the internal database they are not actually removed from Telegram, hence they can be recovered if you scroll up enough.

## Todo

- [ ] Peer-to-peer encryption
- [ ] Self host Telegram Bot API to allow the bot to upload bigger files (with [this](https://hub.docker.com/r/aiogram/telegram-bot-api) maybe)
- [ ] Make easily deployable on Heroku