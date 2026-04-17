import { Page } from '@playwright/test';

/**
 * Wait for a network response matching the given URL pattern.
 * Useful for asserting that an API call was made after an action.
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  trigger: () => Promise<void>,
): Promise<{ status: number; body: unknown }> {
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        typeof urlPattern === 'string'
          ? resp.url().includes(urlPattern)
          : urlPattern.test(resp.url()),
    ),
    trigger(),
  ]);

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = await response.text();
  }

  return { status: response.status(), body };
}
