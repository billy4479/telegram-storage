## Todo

- [X] Peer-to-peer encryption
- [X] Self host Telegram Bot API (see [self-bot-api branch](https://github.com/billy4479/telegram-storage/tree/self-bot-api))
  - [X] Figure out how to serve the files from the container and delete them after
- [ ] Make easily deployable on Heroku
- [ ] Split files bigger than 2GB
- [ ] Download folders
- [ ] File preview
- [X] Move frontend code to SvelteKit for routing
- [ ] Progress while uploading files
- [ ] Avoid stopping the main javascript "thread" while making calls to libsodium and show some kind of loading
  - [ ] Make the crypto part more efficient (for example [here](../frontend/src/lib/crypto/evenChunkReader.ts))
- [ ] Make the UI better and consistent (maybe with [this](https://sveltematerialui.com/)?)
- [ ] Trash can
- [ ] Implement renaming and moving files in the frontend
- [ ] Write some CI to at least see if it build
- [ ] Implement some way to change the password
  - [ ] Would it be possible to even reset it?
