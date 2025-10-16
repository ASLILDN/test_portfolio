import { test, expect } from '@playwright/test';

test('Connexion invalide sur SauceDemo', async ({ page }) => {
  // Ouvrir la page
  await page.goto('https://www.saucedemo.com');

  // Remplir le formulaire avec des identifiants incorrects
  await page.fill('#user-name', 'wrong_user');
  await page.fill('#password', 'wrong_password');

  // Cliquer sur Login
  await page.click('#login-button');

  // Vérifier que le message d'erreur est affiché
  const error = await page.locator('[data-test="error"]');
  await expect(error).toContainText('Epic sadface');
});
