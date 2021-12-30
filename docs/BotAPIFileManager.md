# Bot API File Manager

The whole point of self-hosting the bot API is to be able to use the `--local` flag which allows files up to 2000MB to be uploaded and downloaded.

This flag downloads the files locally and expects us to serve them using some kind of HTTP server. The files saved on the disk and take a lot of space. We are trying to save as much space as possible we'd like to delete them after they got downloaded (or uploaded).

## The solution [`botapifm`](https://github.com/billy4479/botapifm)

This is a _ad-hoc_ program I wrote that manages the bot API's files. Every request to upload or download a file goes through or gets notified to it.

This program will run in the same container as the Telegram Bot API but does not need to connect to it.

### On Upload

 - Since we won't get back the file path on upload, right after the upload is done we make a request for the file URL
 - This request will return the file path
 - The file path will be sent to the proxy server that will delete the file

### On Download

 - Get the file name using the normal Telegram API `getFile`
 - Make a request to the proxy server that will create and expose a endpoint
   - This endpoint will serve the file
   - After the file is downloaded it will be deleted