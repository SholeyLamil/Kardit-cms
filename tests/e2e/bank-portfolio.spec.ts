import { test, expect } from '@playwright/test'

test('dashboard → view as Issuing Bank → portfolio → switch back', async ({ page }) => {
  // Sign in
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/portal$/)

  // Click "View as Issuing Bank" action card
  await page.locator('.action-card').filter({ hasText: 'View as Issuing Bank' }).click()
  await expect(page).toHaveURL(/\/portal\/bank$/)

  // Bank shell renders with the right persona
  await expect(page.getByText('Demo: Issuing Bank role')).toBeVisible()
  await expect(page.locator('header.scr-app-bar').getByText('Chioma N.')).toBeVisible()
  await expect(page.locator('aside.scr-side').getByText('Zenith Bank')).toBeVisible()

  // Bank hero + KPIs
  await expect(page.locator('.bank-hero .bank-name')).toHaveText('Zenith Bank')
  await expect(page.getByText('15,247 cards live')).toBeVisible()

  // Affiliates table rendered with all 6 rows
  const rows = page.locator('.aff-table tbody tr')
  await expect(rows).toHaveCount(6)
  await expect(page.locator('.aff-table').getByText('Kardit Lagos')).toBeVisible()
  await expect(page.locator('.aff-table').getByText('Paystream Abuja')).toBeVisible()

  // Sidebar items are present, with disabled siblings showing the "Soon" pill
  await expect(page.locator('aside.scr-side').getByText('Portfolio')).toBeVisible()
  await expect(page.locator('aside.scr-side').getByText('Drill-down')).toBeVisible()
  await expect(page.locator('aside.scr-side').getByText('Soon')).toBeVisible()

  // Switch back to Affiliate goes to /portal
  await page.getByRole('link', { name: /Switch back to Affiliate/ }).click()
  await expect(page).toHaveURL(/\/portal$/)
})
