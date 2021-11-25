# Telegram Storage

Store files in Telegram messages for free and access them in a nice web UI.

Telegram allows to store files (of max 2GB each) for a unlimited amount of storage.

This project allows you to store files in messages on a Telegram group and
access them in from a WebUI with all the features you'd expect on a normal cloud storage service.

**No public instance for now, I don't have money :)**

## Get started

Add the bot to a group and make it administrator. Type `/link`: the bot will send there all the files.

The bot will send you a token to register into the WebUI for the first time.
Now you will be prompted to enter a password:
you won't be able to change it since the encryption key derives from it (TODO).

Still, is not recommended to leave the group,
since Telegram might not like the bot being alone in a group and could remove the messages
(I'm not sure about this statement but is better not to risk).

When files are deleted from the internal database they are not actually removed from Telegram,
hence they can be recovered if you scroll up enough.

Still lots of stuff to do, see [TODO.md](docs/TODO.md)
