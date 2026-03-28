import { setPassword } from './auth';

const password = process.argv[2] || 'hafsa';
setPassword(password);
console.log(`Password set successfully. Use "${password}" to log in.`);
