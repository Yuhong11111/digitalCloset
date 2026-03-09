// this file is used to create a custom render function that includes all the necessary providers for testing components that rely on Chakra UI and React Router. 
// It allows you to render components in a test environment with the same context they would have in the actual application.

import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { system } from '../theme';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>{children}</BrowserRouter>
    </ChakraProvider>
  );
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: Providers, ...options });
