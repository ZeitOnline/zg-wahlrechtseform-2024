import STARTERKIT_CONFIG from 'src/__starterkit_config.json';

import {
  encrypt as encryptFunction,
  decrypt as decryptFunction,
} from './crypto.js';

const isSSR = import.meta.env.SSR;

let cryptoModule;
async function loadCryptoModule() {
  if (cryptoModule) {
    return;
  }
  if (isSSR) {
    cryptoModule = await import('node:crypto');
  } else {
    cryptoModule = crypto;
  }
}

export async function decrypt(
  ciphertext,
  password = STARTERKIT_CONFIG.deploymentPath,
) {
  await loadCryptoModule();
  return decryptFunction(cryptoModule, ciphertext, password);
}
export async function encrypt(
  plaintext,
  password = STARTERKIT_CONFIG.deploymentPath,
) {
  await loadCryptoModule();
  return encryptFunction(cryptoModule, plaintext, password);
}
