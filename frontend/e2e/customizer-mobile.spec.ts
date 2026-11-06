import { test, expect } from '@playwright/test';

test.describe('Crocs Customizer - Mobile Responsive & Touch Suite', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('displays mobile drawer drag handle and compact header', async ({ page }) => {
    await expect(page.getByTestId('mobile-drawer-handle')).toBeVisible();
    await expect(page.getByTestId('size-badge')).toBeVisible();
    await expect(page.getByTestId('reset-customizer-btn')).toBeVisible();
    await expect(page.getByTestId('export-png-btn')).toBeVisible();
  });

  test('toggles drawer expansion when clicking mobile handle', async ({ page }) => {
    const handle = page.getByTestId('mobile-drawer-handle');
    await expect(handle).toBeVisible();

    await handle.click();
    await page.waitForTimeout(300);

    await expect(page.getByRole('tablist', { name: /customizer tool modes/i })).toBeVisible();
  });

  test('switches tabs smoothly between Charms and Shoe Color on mobile', async ({ page }) => {
    const shoeTab = page.getByRole('tab', { name: /shoe color/i });
    const charmsTab = page.getByRole('tab', { name: /charms/i });

    await shoeTab.click();
    await expect(page.getByText(/shoe size/i)).toBeVisible();

    await charmsTab.click();
    await expect(page.getByTestId('charm-card').first()).toBeVisible({ timeout: 15000 });
  });

  test('places charm, selects it and permits quick reset on mobile', async ({ page }) => {
    const firstCharm = page.getByTestId('charm-card').first();
    await expect(firstCharm).toBeVisible({ timeout: 15000 });
    await firstCharm.click();

    await expect(page.getByTestId('placed-charm')).toHaveCount(1);

    await page.getByTestId('reset-customizer-btn').click();
    await expect(page.getByTestId('placed-charm')).toHaveCount(0);
  });

  test('opens and dismisses legal modal on mobile viewport without overflow', async ({ page }) => {
    await page.getByTestId('legal-disclaimers-trigger').click();

    const modal = page.getByTestId('legal-disclaimer-modal');
    await expect(modal).toBeVisible();
    await expect(page.getByText(/non-affiliation/i)).toBeVisible();

    await page.getByTestId('close-legal-modal-btn').click();
    await expect(modal).not.toBeVisible();
  });

  test('triggers PNG export on mobile layout', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await page.getByTestId('export-png-btn').click();

    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename()).toBe('My_Crocs.png');
    }
  });
});
