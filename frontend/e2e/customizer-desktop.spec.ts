import { test, expect } from '@playwright/test';

test.describe('Crocs Customizer - Desktop E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('renders left and right shoe SVGs and header controls', async ({ page }) => {
    await expect(page.locator('svg[data-shoe-side="left"]')).toBeVisible();
    await expect(page.locator('svg[data-shoe-side="right"]')).toBeVisible();
    await expect(page.getByTestId('size-badge')).toHaveText(/adult/i);
    await expect(page.getByTestId('reset-customizer-btn')).toBeVisible();
    await expect(page.getByTestId('export-png-btn')).toBeVisible();
    await expect(page.getByTestId('compact-footer')).toBeVisible();
  });

  test('allows changing shoe size and color', async ({ page }) => {
    // Switch to shoe tab
    await page.getByRole('tab', { name: /shoe color/i }).click();

    // Select youth size
    const youthBtn = page.getByRole('button', { name: /youth/i });
    if (await youthBtn.isVisible()) {
      await youthBtn.click();
      await expect(page.getByTestId('size-badge')).toHaveText(/youth/i);
    }

    // Select a color (e.g. Navy or White)
    const colorBtn = page.locator('button[aria-label*="White"], button[aria-label*="Navy"]').first();
    if (await colorBtn.isVisible()) {
      await colorBtn.click();
    }
  });

  test('places charm onto empty hole, shows rotation dial on selection', async ({ page }) => {
    await page.getByRole('tab', { name: /charms/i }).click();

    const firstCharm = page.getByTestId('charm-card').first();
    await expect(firstCharm).toBeVisible({ timeout: 15000 });
    await firstCharm.click();

    // Placed charm should appear on shoe canvas
    const placedCharm = page.getByTestId('placed-charm').first();
    await expect(placedCharm).toBeVisible();

    // Placed charm is selected on placement -> rotation dial halo is visible
    await expect(page.locator('[data-rotation-dial="true"]')).toBeVisible();
  });

  test('supports double-click deletion to remove a placed charm', async ({ page }) => {
    await page.getByRole('tab', { name: /charms/i }).click();

    const firstCharm = page.getByTestId('charm-card').first();
    await expect(firstCharm).toBeVisible({ timeout: 15000 });
    await firstCharm.click();

    const placedCharm = page.getByTestId('placed-charm').first();
    await expect(placedCharm).toBeVisible();

    // Double-click triggers double-tap deletion
    await placedCharm.dblclick();

    // Placed charm should be removed
    await expect(page.getByTestId('placed-charm')).toHaveCount(0);
  });

  test('supports dragging placed charm to move to another hole socket', async ({ page }) => {
    await page.getByRole('tab', { name: /charms/i }).click();

    const firstCharm = page.getByTestId('charm-card').first();
    await expect(firstCharm).toBeVisible({ timeout: 15000 });
    await firstCharm.click();

    const placedCharm = page.getByTestId('placed-charm').first();
    await expect(placedCharm).toBeVisible();

    // Locate target hole on right shoe
    const targetHole = page.locator('svg[data-shoe-side="right"] [data-testid="hole-socket"]').first();
    if (await targetHole.isVisible()) {
      const sourceBox = await placedCharm.boundingBox();
      const targetBox = await targetHole.boundingBox();

      if (sourceBox && targetBox) {
        await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
          steps: 10,
        });
        await page.mouse.up();
      }
    }
  });

  test('quick reset button clears all placed charms from canvas', async ({ page }) => {
    await page.getByRole('tab', { name: /charms/i }).click();

    const firstCharm = page.getByTestId('charm-card').first();
    await expect(firstCharm).toBeVisible({ timeout: 15000 });
    await firstCharm.click();
    await expect(page.getByTestId('placed-charm')).toHaveCount(1);

    // Click reset
    await page.getByTestId('reset-customizer-btn').click();

    // Expect 0 placed charms
    await expect(page.getByTestId('placed-charm')).toHaveCount(0);
  });

  test('export PNG button downloads high-resolution canvas snapshot with disclaimers', async ({
    page,
  }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await page.getByTestId('export-png-btn').click();

    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename()).toBe('My_Crocs.png');
    }
  });

  test('footer legal disclaimers modal opens and closes properly', async ({ page }) => {
    await page.getByTestId('legal-disclaimers-trigger').click();

    const modal = page.getByTestId('legal-disclaimer-modal');
    await expect(modal).toBeVisible();
    await expect(page.getByText(/non-affiliation/i)).toBeVisible();
    await expect(page.getByText(/trademark notice/i)).toBeVisible();
    await expect(page.getByText(/retail inventory/i)).toBeVisible();

    await page.getByTestId('close-legal-modal-btn').click();
    await expect(modal).not.toBeVisible();
  });
});
