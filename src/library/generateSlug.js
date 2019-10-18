const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateSlug = () => [...Array(6)]
  .map(() => allowedCharacters[Math.floor(Math.random() * 36)])
  .join('');

module.exports = generateSlug;