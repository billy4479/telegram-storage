// TODO: make the port change according to the actual backend port
const host = import.meta.env.DEV ? `http://localhost:4479` : '';

const apiRoot = host + '/api';

const login = `${apiRoot}/login`;
const files = `${apiRoot}/files`;
const download = `${apiRoot}/download`;

export {
  login as loginEndpoint,
  files as filesEndpoint,
  download as downloadEndpoint,
};

export default host;
