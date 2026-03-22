// this file is used to create a custom render function that includes all the necessary providers for testing components that rely on Chakra UI and React Router. 
// It allows you to render components in a test environment with the same context they would have in the actual application.

import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../theme";

const Providers = ({
  children,
  withRouter = true,
}: {
  children: ReactNode;
  withRouter?: boolean;
}) => (
  <ChakraProvider value={system}>
    {withRouter ? <BrowserRouter>{children}</BrowserRouter> : children}
  </ChakraProvider>
);

export const renderWithProviders = (
  ui: ReactElement,
  {
    withRouter = true,
    ...options
  }: Omit<RenderOptions, "wrapper"> & { withRouter?: boolean } = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <Providers withRouter={withRouter}>{children}</Providers>
    ),
    ...options,
  });

