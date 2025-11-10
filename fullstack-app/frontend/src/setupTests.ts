import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

const globalShim = globalThis as typeof globalThis & {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
  structuredClone?: typeof structuredClone;
};

if (!globalShim.TextEncoder) {
  globalShim.TextEncoder = TextEncoder;
}

if (!globalShim.TextDecoder) {
  globalShim.TextDecoder = TextDecoder as typeof TextDecoder;
}

if (!globalShim.structuredClone) {
  globalShim.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
}
