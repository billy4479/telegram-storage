# How login works

 - `/link` -> Gives a temp JWT
 - Sign up with that token
 - Prompts to choose a password (username is Telegram's username)

## Handling the password

### On the client:
 - Argon2 the password -> Master Key `[1]`
 - Generate a random bytes -> Encryption Key `[2]`
 - Encrypt `[2]` with `[1]` -> Encrypted Encryption Key `[3]`
 - Hash `[1]` -> Authentication Key `[4]`
 - Send `[3]` and `[4]` to the server

### On the server:
 - Receive `[3]` and `[4]`
 - Hash `[4]` -> Hashed Authentication Key `[5]`
 - Store `[3]` and `[5]` on the DB
