import { navigateInternal } from './navigation';

const dirStack: {
  stack: string[];
  index: number;
} = { stack: [], index: 0 };

export function pushDirHist(path: string) {
  dirStack.stack = dirStack.stack.slice(0, dirStack.index + 1);

  let i = dirStack.index;
  while (dirStack.stack[i] === path && i >= 0) {
    dirStack.stack.pop();
    i--;
  }

  dirStack.stack.push(path);
  dirStack.index = dirStack.stack.length - 1;

  console.log(dirStack);
}

export async function dirStackBack() {
  dirStack.index--;
  await navigateInternal(dirStack.stack[dirStack.index]);
  console.log(dirStack);
}

export async function dirStackForward() {
  if (dirStack.index === dirStack.stack.length - 1) return;

  dirStack.index++;
  await navigateInternal(dirStack.stack[dirStack.index]);
  console.log(dirStack);
}
