import { test, expect } from './auth-utils';

test.slow();

test('test access to admin page', async ({ getUserPage }) => {
  // Authenticate as admin
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  // Navigate to the home page
  await adminPage.goto('http://localhost:3000/');

  // Verify the admin is authenticated
  await expect(
    adminPage.getByRole('button', { name: 'admin@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Check navigation elements
  await expect(
    adminPage.getByRole('link', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    adminPage.getByRole('link', { name: 'List Stuff' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    adminPage.getByRole('link', { name: 'Admin' })
  ).toBeVisible({ timeout: 5000 });

  // Test Add Stuff page
  await adminPage.getByRole('link', { name: 'Add Stuff' }).click();

  await expect(
    adminPage.getByRole('heading', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  // Test List Stuff page
  await adminPage.getByRole('link', { name: 'List Stuff' }).click();

  await expect(
    adminPage.getByRole('heading', { name: 'Stuff' })
  ).toBeVisible({ timeout: 5000 });

  // Test Admin page
  await adminPage.getByRole('link', { name: 'Admin' }).click();

  await expect(
    adminPage.getByRole('heading', { name: 'List Stuff Admin' })
  ).toBeVisible({ timeout: 5000 });

  await expect(
    adminPage.getByRole('heading', { name: 'List Users Admin' })
  ).toBeVisible({ timeout: 5000 });
});
