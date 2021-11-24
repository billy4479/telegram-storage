import type { StateAddress } from 'libsodium-wrappers';
import newEvenChunkReader from './evenChunkReader';

type LibSodium =
  typeof import('/home/billy/code/telegram-storage/frontend/node_modules/@types/libsodium-wrappers/index');

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
        const { done, value } = await inputReader.read();
        if (done) break;

        console.log(value.length);

        const m = s.crypto_secretstream_xchacha20poly1305_pull(state, value);
        console.log(m);
        if (typeof m === 'boolean' && !(m as boolean)) {
          const msg = 'Fatal error while decoding message';

          console.error(msg);
          throw new Error(msg);
        }

        const { message, tag } = m;

        if (tag === s.crypto_secretstream_xchacha20poly1305_TAG_FINAL) break;
        controller.enqueue(message);
      }

      controller.enqueue(
        s.crypto_secretstream_xchacha20poly1305_push(
          state,
          new Uint8Array(0),
          null,
          s.crypto_secretstream_xchacha20poly1305_TAG_FINAL
        )
      );

      controller.close();
      inputReader.releaseLock();
    },
  });
}
