module.exports = async hash => {
  if(!/^[a-z0-9]{64}$/.test(hash)) throw new Error('Unrecognised format.  Expected a sha256 hash.');

  const pref = hash.substr(0, 4);
  const rest = hash.substr(4);

  const res = await fetch(`https://alxndrsn.github.io/dehash-ke/v1/phone/sha256/${pref}.json`);
  if(!res.ok) throw new Error(`Unexpected response status: ${res.status}`);

  const hashes = await res.json();
  const phoneNumber = hashes[rest];

  if(!phoneNumber) throw new Error('Hash not found.');

  return phoneNumber;
};
