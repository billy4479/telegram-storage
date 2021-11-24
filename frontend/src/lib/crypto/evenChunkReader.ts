export default function newEvenChunkReader(
  origin: ReadableStream<Uint8Array>,
  chunkSize: number
): ReadableStream<Uint8Array> {
  const reader = origin.getReader();
  let buffer: Uint8Array;
  return new ReadableStream({
    start() {
      buffer = new Uint8Array(chunkSize * 2);
    },
    async pull(controller) {
      const { done, value } = await reader.read();

      if (done) {
        console.log(`[EVEN]: Done!`);
        controller.enqueue(buffer);

        controller.close();
        reader.releaseLock();
      }

      console.log(
        `[EVEN]: Reading new chunk from origin of size ${value.length}`
      );

      try {
        buffer = Uint8Array.from([...buffer, ...value]);
      } catch (error) {
        console.error(error);
      }

      console.log(`[EVEN]: Buffer size is now ${buffer.length} bytes`);

      while (buffer.length >= chunkSize) {
        const chunk = buffer.subarray(0, chunkSize);
        console.log(`[EVEN]: Enqueueing new chunk of size ${chunk.length}`);
        controller.enqueue(chunk);
        buffer = buffer.subarray(chunkSize, buffer.length);
        console.log(`[EVEN]: Still ${buffer.length} bytes buffered`);
      }
    },
    cancel() {
      reader.releaseLock();
    },
  });
}
