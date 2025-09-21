import { expect, test } from '@playwright/test';

test('deck builder loads and shows empty deck state', async ({ page }) => {
  await page.goto('/deck-builder');
  await expect(page.getByText('Card Library')).toBeVisible();
  await expect(page.getByText('Your deck is empty')).toBeVisible();
});

test('save button disabled when deck is empty', async ({ page }) => {
  await page.goto('/deck-builder');
  const save = page.getByRole('button', { name: 'Save Deck' });
  await expect(save).toBeDisabled();
});


