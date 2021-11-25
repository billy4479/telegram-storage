import type { MessageTag, StateAddress } from 'libsodium-wrappers';
import newEvenChunkReader from './evenChunkReader';

type LibSodium =
  typeof import('/home/billy/code/telegram-storage/frontend/node_modules/@types/libsodium-wrappers/index');

function checkDecryptionError(m: MessageTag): boolean {
  return typeof m === 'boolean' && !(m as boolean);
}

export function newDecryptionStream(
  origin: ReadableStream<Uint8Array>,
  chunkSize: number,
  s: LibSodium,
  state: StateAddress
): ReadableStream<Uint8Array> {
  chunkSize += s.crypto_secretstream_xchacha20poly1305_ABYTES;
  const even = newEvenChunkReader(origin, chunkSize);
  const inputReader = even.getReader();

  return new ReadableStream({
    async start(controller: ReadableStreamController<Uint8Array>) {
      while (true) {
        const r = await inputReader.read();
        if (r.done) {
          break;
        }

        const data =
          r.value.length === chunkSize
            ? r.value
            : r.value.subarray(
                0,
                -s.crypto_secretstream_xchacha20poly1305_ABYTES
              );

        const m = s.crypto_secretstream_xchacha20poly1305_pull(state, data);

        if (checkDecryptionError(m)) {
          const msg = 'Fatal error while decoding message';
          console.error(msg);
          return Promise.reject(msg);
        }

        const { message, tag } = m;

        if (tag === s.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
          const msg = 'Unexpected end of stream';
          console.error(msg);
          return Promise.reject(msg);
        }

        controller.enqueue(message);

        if (r.value.length !== chunkSize) {
          const last = r.value.subarray(
            -s.crypto_secretstream_xchacha20poly1305_ABYTES
          );

          const closing = s.crypto_secretstream_xchacha20poly1305_pull(
            state,
            last
          );

          if (checkDecryptionError(closing)) {
            const msg = 'Fatal error while decoding closing message';
            console.error(msg);
            return Promise.reject(msg);
          }

          if (
            closing.tag !== s.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          ) {
            const msg = `Expected end of stream, found ${s.to_base64(
              closing.message
            )}`;
            console.error(msg);
            return Promise.reject(msg);
          }
        }
      }

      controller.close();
      inputReader.releaseLock();
    },
  });
}
