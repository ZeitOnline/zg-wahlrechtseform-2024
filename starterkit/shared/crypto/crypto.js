export async function decrypt(
  cryptoModule,
  ciphertext,
  password,
) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await cryptoModule.subtle.digest('SHA-256', pwUtf8); // hash the password

  const ivStr = atob(ciphertext).slice(0, 12); // decode base64 iv
  const iv = new Uint8Array(Array.from(ivStr).map((ch) => ch.charCodeAt(0))); // iv as Uint8Array

  const alg = {name: 'AES-GCM', iv: iv}; // specify algorithm to use

  const key = await cryptoModule.subtle.importKey('raw', pwHash, alg, false, [
    'decrypt',
  ]); // generate key from pw

  const ctStr = atob(ciphertext).slice(12); // decode base64 ciphertext
  const ctUint8 = new Uint8Array(
    Array.from(ctStr).map((ch) => ch.charCodeAt(0)),
  ); // ciphertext as Uint8Array
  // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

  try {
    const plainBuffer = await cryptoModule.subtle.decrypt(alg, key, ctUint8); // decrypt ciphertext using key
    const plaintext = new TextDecoder().decode(plainBuffer); // plaintext from ArrayBuffer
    return plaintext; // return the plaintext
  } catch (e) {
    throw new Error('Decrypt failed');
  }
}

export async function encrypt(
  cryptoModule,
  plaintext,
  password,
) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await cryptoModule.subtle.digest('SHA-256', pwUtf8); // hash the password

  const iv = cryptoModule.getRandomValues(new Uint8Array(12)); // get 96-bit random iv
  const ivStr = Array.from(iv)
    .map((b) => String.fromCharCode(b))
    .join(''); // iv as utf-8 string

  const alg = {name: 'AES-GCM', iv: iv}; // specify algorithm to use

  const key = await cryptoModule.subtle.importKey('raw', pwHash, alg, false, [
    'encrypt',
  ]); // generate key from pw

  const ptUint8 = new TextEncoder().encode(plaintext); // encode plaintext as UTF-8
  const ctBuffer = await cryptoModule.subtle.encrypt(alg, key, ptUint8); // encrypt plaintext using key

  const ctArray = Array.from(new Uint8Array(ctBuffer)); // ciphertext as byte array
  const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join(''); // ciphertext as string

  return btoa(ivStr + ctStr); // iv+ciphertext base64-encoded
}
