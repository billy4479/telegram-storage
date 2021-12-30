# Telegram Storage

Store files in Telegram messages for free and access them in a nice web UI!

Telegram allows to send files of 2GB max each, and they will be stored on their server as long as you want.

This project allows you to store files in messages on a Telegram group and
access them in from a web interface with all the features you'd expect on a normal cloud storage service, like Google Drive or Dropbox, featuring End-to-End encryption.

**There is no public instance for now, I have no money :)**

## Get started

Add the bot to a group and make it administrator. Type `/link`: the bot will send there all the files.

The bot will send you a token to register into the WebUI for the first time.
Now you will be prompted to enter a password:
make sure you won't forget it (you cannot recover it) and
(for now) you won't be able to change it ([TODO](docs/TODO.md)).

It is not recommended to leave the group,
since Telegram might not like the bot being alone in a group and could remove the messages
(I'm not sure about this statement but is better not to risk).

## Development

All contributions are appreciated!

There is still a lot of work to do! Take a look at [TODO.md](docs/TODO.md) if you want some ideas of where to start.

There is a work-in-progress technical documentation on how this thing works that can be found [here](docs/README.md) but if you have any doubt feel free to open an issue.
