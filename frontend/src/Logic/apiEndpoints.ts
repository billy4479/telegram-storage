// TODO: make the port change according to the actual backend port
const host = import.meta.env.DEV ? `http://localhost:4479` : '';

const apiRoot = host + '/api';

const login = `${apiRoot}/login`;

export const genQuery = (base: string) => {
  return (params: Record<string, string>): string =>
    base + '?' + new URLSearchParams(params);
};

const file = `${apiRoot}/file`;
const download = `${file}/download`;

const folder = `${apiRoot}/folder`;
const list = `${folder}/list`;
const root = `${folder}/root`;

export {
  login as loginEndpoint,
  file as fileEndpoint,
  download as downloadEndpoint,
  folder as folderEndpoint,
  root as rootEndpoint,
  list as listEndpoint,
};

export default host;
