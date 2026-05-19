import { test, expect } from '@playwright/test'

test('signin → reports → generate Card Issuance Report (CSV) → ready', async ({ page }) => {
  // Sign in
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/portal$/)

  // Navigate to Reports via sidebar
  await page.locator('aside.scr-side').getByRole('link', { name: 'Reports' }).click()
  await expect(page).toHaveURL(/\/portal\/reports$/)
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible()

  // Cards are rendered
  await expect(page.getByText('Card Issuance Report', { exact: true })).toBeVisible()
  await expect(page.getByText('Funding Transactions Report', { exact: true })).toBeVisible()

  // Scope to the Card Issuance card and trigger CSV generation
  const issuance = page.locator('.report-card').filter({ hasText: 'Card Issuance Report' })
  await issuance.getByRole('button', { name: 'CSV' }).click()

  // Queued status appears with job id
  await expect(issuance.getByText(/Queued · job REQ-RPT-\d{4}/)).toBeVisible()

  // Ready status appears within a few seconds
  await expect(issuance.getByText(/Ready/)).toBeVisible({ timeout: 5000 })
  await expect(issuance.getByRole('link', { name: /download CSV/ })).toBeVisible()

  // Recent reports panel is rendered
  await expect(page.locator('.recent-reports')).toBeVisible()
  await expect(page.getByText('Card Issuance Report · 2026-05-01 → 2026-05-10')).toBeVisible()
})

test('dashboard action card → reports', async ({ page }) => {
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/portal$/)

  await page.locator('.action-card').filter({ hasText: 'Reports' }).click()
  await expect(page).toHaveURL(/\/portal\/reports$/)
})
