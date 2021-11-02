import { authorizationHeader } from './authentication';

export default async function authenticatedDownload(url: string, name: string) {
  // https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
  const p = fetch(url, {
    headers: authorizationHeader(),
  });

  p.catch((err) => console.error(err));

  const res = await p;
  const blob = await res.blob();

  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
