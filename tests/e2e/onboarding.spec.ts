import { test, expect } from '@playwright/test'

test('partners → onboarding start → org → docs → banks → review → submitted', async ({ page }) => {
  // Land via Partners CTA
  await page.goto('/partners')
  await page.getByRole('link', { name: 'Start Onboarding' }).click()
  await expect(page).toHaveURL(/\/onboarding$/)
  await expect(page.getByRole('heading', { name: /Welcome to Kardit/ })).toBeVisible()

  // Start fresh
  await page.locator('.onb-card').filter({ hasText: 'Start fresh' }).getByRole('link', { name: /Start Onboarding/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/org$/)
  await expect(page.getByRole('heading', { name: /Tell us about your organization/ })).toBeVisible()

  // Form is pre-populated from default seed — Next succeeds straight to docs
  await page.getByRole('button', { name: /Next: Documents/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/docs$/)

  // Upload all 5 required docs
  for (const label of ['CAC Certificate', 'Memorandum & Articles', 'TIN Certificate', 'Director ID(s)', 'Proof of Address']) {
    await page.locator(`div`, { hasText: label }).filter({ hasText: 'Upload' })
      .getByRole('button', { name: 'Upload' })
      .first()
      .click()
  }
  await expect(page.getByText('Required documents (5/5)')).toBeVisible()

  // Next → banks
  await page.getByRole('link', { name: /Next: Banks/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/banks$/)

  // Select Zenith and GTB
  await page.getByRole('checkbox', { name: /Zenith Bank/i }).check()
  await page.getByRole('checkbox', { name: /Guaranty Trust Bank/i }).check()
  await expect(page.getByText('2 selected')).toBeVisible()

  // Review
  await page.getByRole('link', { name: /Review & Submit/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/review$/)
  await expect(page.getByRole('heading', { name: 'Review your application' })).toBeVisible()

  // Confirm terms
  const submit = page.getByRole('button', { name: /Submit application/ })
  await expect(submit).toBeDisabled()
  await page.locator('input[type="checkbox"]').first().check()
  await expect(submit).toBeEnabled()
  await submit.click()

  // Submitted screen
  await expect(page).toHaveURL(/\/onboarding\/submitted$/)
  await expect(page.getByRole('heading', { name: /You're all set/ })).toBeVisible()
  await expect(page.getByText(/KAR-\d{4}-\d{2}-\d{4}/)).toBeVisible()
})

test('review with missing docs → errors screen', async ({ page }) => {
  await page.goto('/onboarding/review')
  await page.locator('input[type="checkbox"]').first().check()
  await page.getByRole('button', { name: /Submit application/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/errors$/)
  await expect(page.getByRole('heading', { name: "We can't submit yet." })).toBeVisible()
})

test('status → respond → status (clarification → review)', async ({ page }) => {
  await page.goto('/onboarding/status')
  await expect(page.getByRole('heading', { name: /KAR-/ })).toBeVisible()
  await expect(page.getByText('Clarification requested')).toBeVisible()

  await page.getByRole('link', { name: /Respond to Clarification/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/respond$/)

  await page.getByPlaceholder('Add a short note for the compliance team...').fill('Reuploaded — full file attached.')
  await page.getByRole('button', { name: /Submit response/ }).click()
  await expect(page).toHaveURL(/\/onboarding\/status$/)
  // After response, banner is gone and stage shifted to "In review"
  await expect(page.getByText('Clarification requested')).toHaveCount(0)
  await expect(page.locator('.onb-tag').filter({ hasText: 'In review' })).toBeVisible()
})
