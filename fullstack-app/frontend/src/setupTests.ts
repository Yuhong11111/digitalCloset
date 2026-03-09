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
  globalShim.structuredClone = <T>(value: T): T => {
    if (value === undefined || typeof value === "function") {
      return value;
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  };
}

const originalConsoleError = console.error;
const reactActDeprecation = /ReactDOMTestUtils\.act is deprecated in favor of React\.act/;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const [firstArg] = args;
    if (typeof firstArg === 'string' && reactActDeprecation.test(firstArg)) {
      return;
    }
    originalConsoleError(...args);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});
