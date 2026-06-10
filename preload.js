import { webcrypto } from 'node:crypto';

// Only set crypto if it does not already exist
if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
}
