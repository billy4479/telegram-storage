const host = import.meta.url
  ? import.meta.url.startsWith('http://localhost:3000/')
    ? 'http://localhost:4479'
    : ''
  : '';
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
