import { test, expect } from '@playwright/test';

test('Ajouter un produit au panier sur SauceDemo', async ({ page }) => {
  // Ouvrir la page
  await page.goto('https://www.saucedemo.com');

  // Connexion avec un compte valide
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Vérifier que la page d’inventaire est affichée
  await expect(page).toHaveURL(/.*inventory.html/);

  // Ajouter le premier produit au panier
  await page.click('button[id^="add-to-cart"]');

  // Vérifier que le panier contient 1 article
  const cartCount = await page.locator('.shopping_cart_badge');
  await expect(cartCount).toHaveText('1');
});
