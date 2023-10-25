'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';

export const Providers = (props: {children: React.ReactNode}): JSX.Element => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
