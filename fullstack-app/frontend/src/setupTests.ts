import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

const globalShim = globalThis as typeof globalThis & {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
};

if (!globalShim.TextEncoder) {
  globalShim.TextEncoder = TextEncoder;
}

if (!globalShim.TextDecoder) {
  globalShim.TextDecoder = TextDecoder as typeof TextDecoder;
}
