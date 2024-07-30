import cryptoModule from 'node:crypto';

import STARTERKIT_CONFIG from '../../../src/__starterkit_config.json' assert {type: 'json'};

import {
  encrypt as encryptFunction,
  decrypt as decryptFunction,
} from './crypto.js';

export async function decrypt(
  ciphertext,
  password = STARTERKIT_CONFIG.deploymentPath,
) {
  return decryptFunction(cryptoModule, ciphertext, password);
}
export async function encrypt(
  plaintext,
  password = STARTERKIT_CONFIG.deploymentPath,
) {
  return encryptFunction(cryptoModule, plaintext, password);
}
