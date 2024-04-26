module.exports = owner => {
  const ownerPrefix = `[${owner}]`;
  return (...args) => console.log(ownerPrefix, ...args);
};
