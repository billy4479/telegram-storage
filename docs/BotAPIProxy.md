# Bot API File Manager

We want to use the `--local` flag on the bot api to allow files up to 2000MB to be uploaded and downloaded.

This flag downloads the files locally and expects us to serve them using some kind of HTTP server but since we are trying to save as much space as possible we'd like to delete them after they got downloaded (or uploaded).

## The solution

Every request to upload or download a file has to go through (or at least be notified) to the `botapifm`.

This program will run in the same container as the Telegram Bot API.

### On Upload

 - Since we won't get back the file path on upload, right after the upload is done we make a request for the file URL
 - This request will return the file path
 - The file path will be sent to the proxy server that will delete the file

### On Download

 - Get the file name using the normal Telegram API `getFile`
 - Make a request to the proxy server that will create and expose a endpoint
   - This endpoint will serve the file
   - After the file is downloaded it will be deleted
