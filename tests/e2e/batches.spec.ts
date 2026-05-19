import { test, expect } from '@playwright/test'

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/signin')
  await page.getByLabel('Work email').fill('adaeze@example.com')
  await page.locator('#s-pwd').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/portal$/)
}

test('dashboard → batches → upload → validation → submit → approval → processing → result', async ({ page }) => {
  await signIn(page)

  // Enter via dashboard action card
  await page.locator('.action-card').filter({ hasText: 'Batch issuance' }).click()
  await expect(page).toHaveURL(/\/portal\/batches$/)
  await expect(page.getByRole('heading', { name: 'Batch issuance' })).toBeVisible()

  // Stepper is visible and "Browse batches" is active
  await expect(page.locator('.hstepper')).toBeVisible()
  await expect(page.locator('.hstep.is-active')).toContainText('Browse batches')

  // Recent batch table renders all 7 rows
  await expect(page.locator('table.data tbody tr')).toHaveCount(7)

  // New batch → Upload
  await page.getByRole('link', { name: /New batch/ }).click()
  await expect(page).toHaveURL(/\/portal\/batches\/upload$/)
  await expect(page.getByRole('heading', { name: 'New batch upload' })).toBeVisible()

  // Submit is disabled until a file is chosen
  const submit = page.getByRole('button', { name: /Upload & validate/ })
  await expect(submit).toBeDisabled()

  // Set a fake file
  await page.setInputFiles('input[type="file"]', {
    name: 'test_batch.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('firstName,lastName\nAda,Okafor\n'),
  })
  await expect(submit).toBeEnabled()
  await expect(page.locator('.dropzone.has-file')).toBeVisible()

  // Continue to validation
  await submit.click()
  await expect(page).toHaveURL(/\/portal\/batches\/validation$/)
  await expect(page.getByRole('heading', { name: 'Validation summary' })).toBeVisible()
  await expect(page.locator('table.data tbody tr')).toHaveCount(8) // 8 invalid rows seeded

  // Continue to submit
  await page.getByRole('link', { name: /Continue with 239 valid rows/ }).click()
  await expect(page).toHaveURL(/\/portal\/batches\/submit$/)
  await expect(page.getByRole('heading', { name: 'Submit batch for approval' })).toBeVisible()

  // Submit for approval → approval queue
  await page.getByRole('link', { name: 'Submit for approval' }).click()
  await expect(page).toHaveURL(/\/portal\/batches\/approval$/)
  await expect(page.getByRole('heading', { name: 'Approval queue' })).toBeVisible()

  // Queue selection — click second item, detail panel updates
  await page.locator('.queue-item').nth(1).click()
  await expect(page.locator('.queue-item.selected')).toContainText('BATCH-2026-00023')

  // Approve → processing
  await page.getByRole('link', { name: /Approve and process/ }).click()
  await expect(page).toHaveURL(/\/portal\/batches\/processing$/)
  await expect(page.getByRole('heading', { name: 'Processing batch' })).toBeVisible()
  await expect(page.locator('.progress-bar .progress-fill')).toBeVisible()

  // Skip ahead to result
  await page.getByRole('link', { name: /Skip ahead to result summary/ }).click()
  await expect(page).toHaveURL(/\/portal\/batches\/result$/)
  await expect(page.getByRole('heading', { name: 'Batch complete' })).toBeVisible()
  await expect(page.locator('.failure-cluster')).toHaveCount(3)
})

test('dashboard recent-activity "Batch completed" links to result', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: /Batch BATCH-2026-00018 completed/ }).click()
  await expect(page).toHaveURL(/\/portal\/batches\/result$/)
})
