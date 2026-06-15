import { PassThrough } from 'node:stream';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { routes } from './Router';
import { theme } from './theme';

function createServerApp(pathname: string) {
  const router = createMemoryRouter(routes, { initialEntries: [pathname] });

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

function preloadLazyRoute(pathname: string) {
  return new Promise<void>((resolve, reject) => {
    const output = new PassThrough();
    let settled = false;
    let renderError: Error | null = null;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        abort();
        reject(new Error(`Timed out while prerendering ${pathname}`));
      }
    }, 15000);
    timeout.unref();

    output.on('end', () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);

      if (renderError) {
        reject(renderError);
      } else {
        resolve();
      }
    });
    output.on('error', reject);
    output.resume();

    const { pipe, abort } = renderToPipeableStream(createServerApp(pathname), {
      onAllReady() {
        pipe(output);
      },
      onShellError(error) {
        settled = true;
        clearTimeout(timeout);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
      onError(error) {
        renderError ??= error instanceof Error ? error : new Error(String(error));
      },
    });
  });
}

export async function render(pathname: string) {
  await preloadLazyRoute(pathname);
  return renderToString(createServerApp(pathname));
}
