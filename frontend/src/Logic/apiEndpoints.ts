const host = import.meta.url.startsWith('http://localhost:3000/')
  ? 'http://localhost:4479'
  : '';
const apiRoot = host + '/api';

const login = `${apiRoot}/login`;
const files = `${apiRoot}/files`;

export { login, files };

export default host;
