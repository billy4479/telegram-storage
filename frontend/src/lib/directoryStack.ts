const dirStack: {
  stack: string[];
  index: number;
} = { stack: [], index: 0 };

export function pushDirHist(path: string): string {
  dirStack.stack = dirStack.stack.slice(0, dirStack.index + 1);

  let i = dirStack.index;
  while (dirStack.stack[i] === path && i >= 0) {
    dirStack.stack.pop();
    i--;
  }

  dirStack.stack.push(path);
  dirStack.index = dirStack.stack.length - 1;

  return path;
}

export function dirStackBack(): string {
  dirStack.index--;

  if (dirStack.index <= 0) dirStack.index = 0;

  return dirStack.stack[dirStack.index];
}

export function dirStackForward(): string {
  if (dirStack.index !== dirStack.stack.length - 1) {
    dirStack.index++;
  }

  return dirStack.stack[dirStack.index];
}
