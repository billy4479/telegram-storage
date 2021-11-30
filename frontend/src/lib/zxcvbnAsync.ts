import type { ZXCVBNResult } from 'zxcvbn';

export async function zxcvbnAsync(password: string): Promise<ZXCVBNResult> {
  return import('zxcvbn').then((zxcvbn) => zxcvbn.default(password));
}
