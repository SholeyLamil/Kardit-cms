import { test, expect } from '@playwright/test'

test('signin → load funds (cold-start picker → form → review → result)', async ({ page }) => {
  // Sign in
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/portal$/)

  // Go to Load funds via sidebar
  await page.locator('aside.scr-side').getByRole('link', { name: 'Funds' }).click()
  await expect(page).toHaveURL(/\/portal\/funds$/)

  // Cold start — pick Tunde's card
  await expect(page.getByRole('heading', { name: 'Choose a card' })).toBeVisible()
  await page.getByRole('link', { name: /5061.*4421/ }).click()
  await expect(page).toHaveURL(/\/portal\/funds\?cardId=CARD-2026-VRP01029$/)

  // Form
  await page.locator('#amount').fill('25000')
  await page.locator('#transferRef').fill('TRF-2026-AUTOTEST')
  await page.getByRole('button', { name: /Continue to review/ }).click()

  // Review
  await expect(page).toHaveURL(/\/portal\/funds\/review$/)
  await expect(page.getByRole('heading', { name: 'Review & submit' })).toBeVisible()
  await expect(page.getByText('₦25,000.00').first()).toBeVisible()
  await page.getByRole('button', { name: /Submit for approval/ }).click()

  // Result
  await expect(page).toHaveURL(/\/portal\/funds\/result$/)
  await expect(page.getByRole('heading', { name: 'Funds loaded' }).or(page.getByText('Funds loaded').first())).toBeVisible()
  await expect(page.getByText('Approved by Folake A.')).toBeVisible()
})

test('warm-start: card-detail Load funds → form pre-fills card', async ({ page }) => {
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/portal$/)

  // Land on card detail (CARD-2026-VRP01029 = Tunde, ACTIVE)
  await page.goto('/portal/card/CARD-2026-VRP01029')
  await page.getByRole('link', { name: 'Load funds' }).click()

  // Should warm-start with the card preselected (no card picker)
  await expect(page).toHaveURL(/\/portal\/funds\?cardId=CARD-2026-VRP01029$/)
  await expect(page.getByRole('heading', { name: 'Choose a card' })).not.toBeVisible()
  await expect(page.getByText(/Tunde Bakare/)).toBeVisible()
})
