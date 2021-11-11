# Encryption

## Registration

 - `/link` -> Gives a temp JWT
 - Sign up with that token
 - Prompts to choose a password (username is Telegram's username)

## Generating the keys

#### Inputs:
 - Password -> `[p]`

### Client:
 - Argon2 `[p]` -> `[M]`
 - Generate keypair (with [this(?)](https://www.npmjs.com/package/curve25519-js)) `[pair]`
 - Encrypt `[pair.priv]` with `[M]` -> `[pair.priv.enc]`
 - Hash `[M]` -> `[auth]`
 - Send `[pair.pub]`, `[pair.priv.enc]` and `[auth]` to the server

### Server:
 - Receive `[pair.pub]`, `[pair.priv.enc]` and `[auth]`
 - Hash `[auth]` -> `[auth.hash]`
 - Store `[pair.pub]`, `[pair.priv.enc]` and `[auth.hash]` on the DB

## On password change

#### Inputs:

- Old password -> `[p.old]`
- New password -> `[p.new]`

### Client

- Argon2 `[p.old]` and `[p.new]` -> `[M.old]`, `[M.new]`
- Get keypair from server and decrypt it with `[M.old]` -> `[pair.priv]`, `[pair.pub]`
- (Maybe recreate the keys?)
  - Every file must be resigned and the encKey must be re-encrypted
- Encrypt `[pair.priv]` with `[M.new]`
- Hash `[M.new]` -> `[auth]`
- Send `[pair.pub]`, `[pair.priv.enc]` and `[auth]`

### Server:
 - Receive `[pair.pub]`, `[pair.priv.enc]` and `[auth]`
 - Hash `[auth]` -> `[auth.hash]`
 - Update `[pair.pub]`, `[pair.priv.enc]` and `[auth.hash]` in the DB

## On file upload

#### Inputs

 - Master Key -> `[M]`
 - File -> `[file]`

### Client:
 - Get keypair from server and decrypt it with `[M]` -> `[pair.priv]`, `[pair.pub]`
 - Generate random bytes -> `[encKey]`
 - Hash `[file]` -> `[file.hash]`
 - AES `[file]` with `[encKey]` -> `[file.crypt]`
 - Encrypt `[encKey]` with `[pair.pub]` -> `[encKey.crypt]`
 - Sign `[file.hash]` with `[pair.priv]` -> `[file.sig]`
 - Send `[file.crypt]`, `[encKey.crypt]` and `[file.sig]` to the server

### Server
 - Receive  `[file.crypt]`, `[encKey.crypt]` and `[file.sig]`
 - Verify `[file.sig]` (just the signature not the hash)
 - Upload `[file.crypt]` to Telegram using `[encKey.crypt]` as caption (for recovery)
 - Store `[file.crypt]`, `[encKey.crypt]` and `[file.sig]` in the DB
