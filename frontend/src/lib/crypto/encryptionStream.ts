import type { StateAddress } from 'libsodium-wrappers';

type LibSodium = typeof import('libsodium-wrappers/index');

export function newEncryptionStream(
  blob: Blob,
  chunkSize: number,
  s: LibSodium,
  state: StateAddress
): ReadableStream<Uint8Array> {
  let pointer = 0;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const end =
        pointer + chunkSize > blob.size ? blob.size : pointer + chunkSize;

      const value = new Uint8Array(
        await blob.slice(pointer, end).arrayBuffer()
      );

      pointer = end;

      const enc = s.crypto_secretstream_xchacha20poly1305_push(
        state,
        value,
        null,
        s.crypto_secretstream_xchacha20poly1305_TAG_PUSH
      );

      controller.enqueue(enc);

      if (end == blob.size) {
        controller.enqueue(
          s.crypto_secretstream_xchacha20poly1305_push(
            state,
            new Uint8Array(0),
            null,
            s.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          )
        );

        controller.close();
      }
    },
  });
}
