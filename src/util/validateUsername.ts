export default function validateUsername(username: string) {
  if (paths.find((path) => path === username) || username.match(/\W|_/g) || username.trim() === '')
    throw { code: 'auth/invalid-username' };
}

const paths = ['accounts', 'p', '404', 'settings', 'direct'];
