// TODO: make the port change according to the actual backend port
const host = import.meta.env.DEV ? `http://localhost:4479` : '';

const apiRoot = host + '/api';

const user = `${apiRoot}/user`;
const login = `${user}/login`;
const register = `${user}/register`;

const file = `${apiRoot}/file`;
const download = `${file}/download`;

const folder = `${apiRoot}/folder`;
const list = `${folder}/list`;
const root = `${folder}/root`;

export const genQuery = (base: string) => {
  return (params: Record<string, string>): string =>
    base + '?' + new URLSearchParams(params);
};

export async function checkFetchError(p: Promise<Response>): Promise<{
  ok: boolean;
  res: Response;
  message?: string;
}> {
  let message = '';
  let ok = true;
  p.catch((err) => {
    message = err;
    ok = false;
  });
  const res = await p;
  if (!ok) {
    return {
      ok,
      message,
      res,
    };
  }

  if (!res.ok) {
    return { ok: false, message: await res.text(), res };
  }

  return { ok, message: undefined, res };
}

export {
  user as userEndpoint,
  login as loginEndpoint,
  register as registerEndpoint,
  file as fileEndpoint,
  download as downloadEndpoint,
  folder as folderEndpoint,
  root as rootEndpoint,
  list as listEndpoint,
};

export default host;
