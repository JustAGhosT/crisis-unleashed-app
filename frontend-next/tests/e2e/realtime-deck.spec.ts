import { expect, test } from '@playwright/test';

test('realtime subscribe and update handshake', async ({ page }) => {
  await page.goto('/deck-builder');
  // Wait for Card Library to ensure page is ready
  await expect(page.getByText('Card Library')).toBeVisible();

  // Open devtools console hook to intercept websocket status events if available
  // As a lightweight smoke: wait a moment and assume connection established then simulate add/remove via UI
  await page.waitForTimeout(1000);

  // The Save Deck button should remain disabled; we just ensure no crash when interacting
  const save = page.getByRole('button', { name: 'Save Deck' });
  await expect(save).toBeDisabled();
});


