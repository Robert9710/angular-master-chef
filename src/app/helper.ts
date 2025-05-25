let username: string = '';

export const getApiDomain = (): string => {
  return location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://angular-master-chef.onrender.com';
};
