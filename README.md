# Telegram Storage
Store files on Telegram cloud for free and access them in a nice web UI.

Telegram allows to store files (of max 1.5GB) for a unlimited ammount of storage.

This project allows you to store files on a Telegram group and
access them in a nice web UI that allows to do all the things you'd expect on a normal cloud storage service.

## How it works

This project consists of three parts: 
 - An API (written in Go)
 - A Bot (written in Go)
 - The UI (written in Svelte)

Users will have to start the bot, create a group with the bot and make it amministrator.

Typing `/link` will link the user to that group: the bot will send there all the files.

You will recive a token to login into the web UI, it will be your password. (It can be resetted by using `/link` again)

## Privacy

It's highly recomanded to self-host this: the database stores all files link and they are not restricted in any way.
The API will never return the direct link to the file on Telegram's servers and require authentication on download
yet the server owner will be able to download all files from all users.
You may mitigate this by encrypting your files before uploading them.
