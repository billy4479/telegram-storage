import type { StateAddress } from 'libsodium-wrappers';
import newEvenChunkReader from './evenChunkReader';

type LibSodium =
  typeof import('/home/billy/code/telegram-storage/frontend/node_modules/@types/libsodium-wrappers/index');

export function newEncryptionStream(
  origin: ReadableStream<Uint8Array>,
  chunkSize: number,
  s: LibSodium,
  state: StateAddress
): ReadableStream<Uint8Array> {
  const even = newEvenChunkReader(origin, chunkSize);
  const inputReader = even.getReader();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      while (true) {
        const { done, value } = await inputReader.read();
        if (done) break;

        const enc = s.crypto_secretstream_xchacha20poly1305_push(
          state,
          value,
          null,
          s.crypto_secretstream_xchacha20poly1305_TAG_PUSH
        );

        console.log({ original: value.length, encrypted: enc.length });
        controller.enqueue(enc);
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
