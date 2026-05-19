import { test, expect } from '@playwright/test'

test('signin → dashboard → issue virtual card → result', async ({ page }) => {
  // Sign in
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()

  // Dashboard
  await expect(page).toHaveURL(/\/portal$/)
  await expect(page.getByRole('heading', { name: /Good afternoon/ })).toBeVisible()

  // Start issuance via sidebar (avoids text overlap on action cards)
  await page.locator('aside.scr-side').getByRole('link', { name: 'Cards' }).click()
  await expect(page).toHaveURL(/\/portal\/issue-card$/)

  await page.getByRole('link', { name: /Create Customer & Issue Card/ }).click()
  await expect(page).toHaveURL(/\/portal\/issue-card\/customer$/)

  // Customer form
  await page.getByLabel('First name').fill('Adaeze')
  await page.getByLabel('Last name').fill('Test')
  await page.getByLabel('Date of birth').fill('1991-08-14')
  await page.getByLabel('Mobile number').fill('+234 803 555 0142')
  await page.getByLabel('Street address').fill('14 Bourdillon Road, Ikoyi')
  await page.getByLabel('LGA').fill('Eti-Osa')
  await page.getByLabel('BVN').fill('22123456789')
  await page.getByRole('button', { name: /Save & continue/ }).click()

  // Card selection — bank + product + virtual
  await expect(page).toHaveURL(/\/portal\/issue-card\/card$/)
  await page.getByText('Zenith Bank').click()
  await page.getByText('Verve Prepaid Standard').first().click()
  await page.getByText('Virtual', { exact: true }).click()
  await page.getByRole('button', { name: /Continue/ }).click()

  // Review — virtual skips delivery
  await expect(page).toHaveURL(/\/portal\/issue-card\/review$/)
  await expect(page.getByRole('heading', { name: 'Review & confirm' })).toBeVisible()
  await page.getByRole('button', { name: /Issue card/ }).click()

  // Result
  await expect(page).toHaveURL(/\/portal\/issue-card\/result$/)
  await expect(page.getByText('Card issued')).toBeVisible()
  await expect(page.getByText('ACTIVE').first()).toBeVisible()
})
