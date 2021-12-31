import type { MessageTag, StateAddress } from 'libsodium-wrappers';

type LibSodium = typeof import('libsodium-wrappers/index');

function checkDecryptionError(m: MessageTag): boolean {
  return typeof m === 'boolean' && !(m as boolean);
}

export function newDecryptionStream(
  blob: Blob,
  chunkSize: number,
  s: LibSodium,
  state: StateAddress
): ReadableStream<Uint8Array> {
  chunkSize += s.crypto_secretstream_xchacha20poly1305_ABYTES;
  let pointer = 0;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const end =
        pointer + chunkSize > blob.size ? blob.size : pointer + chunkSize;

      const value = new Uint8Array(
        await blob.slice(pointer, end).arrayBuffer()
      );

      pointer = end;

      const data =
        value.length === chunkSize
          ? value
          : value.subarray(0, -s.crypto_secretstream_xchacha20poly1305_ABYTES);

      const m = s.crypto_secretstream_xchacha20poly1305_pull(state, data);

      if (checkDecryptionError(m)) {
        const msg = 'Fatal error while decoding message';
        console.error(msg);
        return Promise.reject(new Error(msg));
      }

      const { message, tag } = m;

      if (tag === s.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
        const msg = 'Unexpected end of stream';
        console.error(msg);
        return Promise.reject(new Error(msg));
      }

      controller.enqueue(message);

      // The size is different than what it should be, this means that it was the last chunk
      // We still decode it and make sure it is, in fact, the closing tag
      if (value.length !== chunkSize) {
        console.log('last');

        const last = value.subarray(
          -s.crypto_secretstream_xchacha20poly1305_ABYTES
        );

        const closing = s.crypto_secretstream_xchacha20poly1305_pull(
          state,
          last
        );

        if (checkDecryptionError(closing)) {
          const msg = 'Fatal error while decoding closing message';
          console.error(msg);
          return Promise.reject(new Error(msg));
        }

        if (closing.tag !== s.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
          const msg = `Expected end of stream, found ${s.to_base64(
            closing.message
          )}`;
          console.error(msg);
          return Promise.reject(new Error(msg));
        }

        // All done, we can close the stream
        controller.close();
      }
    },
  });
}
