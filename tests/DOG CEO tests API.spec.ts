import { test, expect } from '@playwright/test';

// Configuration de base
const BASE_URL = 'https://dog.ceo/api';

test.describe('Dog CEO API - Tests de Base', () => {
  
  // TEST 1 : Vérifier que l'API répond correctement
  test('GET /breeds/list/all - Devrait retourner status 200', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    expect(response.status()).toBe(200);
  });

  // TEST 2 : Vérifier le Content-Type
  test('GET /breeds/list/all - Devrait retourner du JSON', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  // TEST 3 : Vérifier la structure de la réponse
  test('GET /breeds/list/all - Devrait avoir message et status', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const data = await response.json();
    
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('success');
  });

  // TEST 4 : Vérifier le nombre de races
  test('GET /breeds/list/all - Devrait contenir plus de 50 races', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const data = await response.json();
    
    const breeds = Object.keys(data.message);
    expect(breeds.length).toBeGreaterThan(50);
    console.log(`Nombre total de races : ${breeds.length}`);
  });

  // TEST 5 : Vérifier le temps de réponse
  test('GET /breeds/list/all - Devrait répondre en moins de 2 secondes', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000);
    console.log(`Temps de réponse : ${responseTime}ms`);
  });
});

test.describe('Dog CEO API - Tests des Races', () => {
  
  // TEST 6 : Vérifier que certaines races ont des sous-races
  test('GET /breeds/list/all - Bulldog devrait avoir des sous-races', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const data = await response.json();
    
    expect(data.message).toHaveProperty('bulldog');
    expect(Array.isArray(data.message.bulldog)).toBeTruthy();
    expect(data.message.bulldog.length).toBeGreaterThan(0);
    console.log(`Sous-races de bulldog : ${data.message.bulldog.join(', ')}`);
  });

  // TEST 7 : Vérifier qu'une race sans sous-race renvoie un tableau vide
  test('GET /breeds/list/all - Affenpinscher devrait avoir un tableau vide', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const data = await response.json();
    
    expect(data.message).toHaveProperty('affenpinscher');
    expect(Array.isArray(data.message.affenpinscher)).toBeTruthy();
    expect(data.message.affenpinscher.length).toBe(0);
  });

  // TEST 8 : Vérifier les sous-races d'une race spécifique
  test('GET /breed/hound/list - Devrait lister les sous-races de hound', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breed/hound/list`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(Array.isArray(data.message)).toBeTruthy();
    expect(data.message.length).toBeGreaterThan(0);
    console.log(`Sous-races de hound : ${data.message.join(', ')}`);
  });

  // TEST 9 : Test négatif - Race inexistante
  test('GET /breed/raceInexistante/list - Devrait retourner une erreur', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breed/raceInexistante/list`);
    const data = await response.json();
    
    expect(response.status()).toBe(404);
    expect(data.status).toBe('error');
    expect(data.message).toContain('not found');
  });

  // TEST 10 : Vérifier que les noms de races sont en minuscules
  test('GET /breeds/list/all - Tous les noms de races en minuscules', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const data = await response.json();
    
    const breeds = Object.keys(data.message);
    breeds.forEach(breed => {
      expect(breed).toBe(breed.toLowerCase());
    });
  });
});

test.describe('Dog CEO API - Tests des Images', () => {
  
  // TEST 11 : Vérifier l'image aléatoire
  test('GET /breeds/image/random - Devrait retourner une URL d\'image', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/image/random`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(typeof data.message).toBe('string');
    expect(data.message).toContain('https://images.dog.ceo');
    console.log(`Image aléatoire : ${data.message}`);
  });

  // TEST 12 : Vérifier le format de l'URL d'image
  test('GET /breeds/image/random - URL devrait finir par .jpg ou .png', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/image/random`);
    const data = await response.json();
    
    const imageUrl = data.message;
    const validFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    const hasValidFormat = validFormats.some(format => imageUrl.toLowerCase().endsWith(format));
    
    expect(hasValidFormat).toBeTruthy();
  });

  // TEST 13 : Vérifier plusieurs images aléatoires
  test('GET /breeds/image/random/5 - Devrait retourner 5 images', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/image/random/5`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(Array.isArray(data.message)).toBeTruthy();
    expect(data.message.length).toBe(5);
    
    // Vérifier que toutes les URLs sont valides
    data.message.forEach(url => {
      expect(url).toContain('https://images.dog.ceo');
    });
  });

  // TEST 14 : Vérifier que l'image est accessible
  test('GET /breeds/image/random - L\'image devrait être accessible', async ({ request }) => {
    // Récupérer l'URL de l'image
    const response = await request.get(`${BASE_URL}/breeds/image/random`);
    const data = await response.json();
    const imageUrl = data.message;
    
    // Tester que l'image existe
    const imageResponse = await request.get(imageUrl);
    expect(imageResponse.status()).toBe(200);
    
    // Vérifier le Content-Type de l'image
    const imageContentType = imageResponse.headers()['content-type'];
    expect(imageContentType).toMatch(/image\/(jpeg|jpg|png|gif)/);
  });

  // TEST 15 : Vérifier l'unicité des images aléatoires
  test('GET /breeds/image/random - Deux appels devraient donner des images différentes', async ({ request }) => {
    const response1 = await request.get(`${BASE_URL}/breeds/image/random`);
    const data1 = await response1.json();
    
    const response2 = await request.get(`${BASE_URL}/breeds/image/random`);
    const data2 = await response2.json();
    
    // Note : Il y a une petite chance que ce test échoue si on tombe sur la même image
    // mais avec des centaines d'images, c'est peu probable
    expect(data1.message).not.toBe(data2.message);
  });
});

test.describe('Dog CEO API - Tests par Race Spécifique', () => {
  
  // TEST 16 : Vérifier les images d'une race spécifique
  test('GET /breed/husky/images - Devrait retourner des images de husky', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breed/husky/images`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(Array.isArray(data.message)).toBeTruthy();
    expect(data.message.length).toBeGreaterThan(0);
    
    // Vérifier que toutes les URLs contiennent "husky"
    data.message.forEach(url => {
      expect(url.toLowerCase()).toContain('husky');
    });
    
    console.log(`Nombre d'images de husky : ${data.message.length}`);
  });

  // TEST 17 : Vérifier une image aléatoire d'une race spécifique
  test('GET /breed/beagle/images/random - Devrait retourner une image de beagle', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breed/beagle/images/random`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(typeof data.message).toBe('string');
    expect(data.message.toLowerCase()).toContain('beagle');
  });

  // TEST 18 : Vérifier plusieurs images d'une race spécifique
  test('GET /breed/retriever/images/random/3 - Devrait retourner 3 images de retriever', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breed/retriever/images/random/3`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(Array.isArray(data.message)).toBeTruthy();
    expect(data.message.length).toBe(3);
    
    // Vérifier que toutes les URLs contiennent "retriever"
    data.message.forEach(url => {
      expect(url.toLowerCase()).toContain('retriever');
    });
  });

  // TEST 19 : Vérifier les images d'une sous-race
  test('GET /breed/bulldog/french/images - Devrait retourner des images de bouledogue français', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breed/bulldog/french/images`);
    const data = await response.json();
    
    expect(response.status()).toBe(200);
    expect(data.status).toBe('success');
    expect(Array.isArray(data.message)).toBeTruthy();
    expect(data.message.length).toBeGreaterThan(0);
    
    // Vérifier que les URLs contiennent "bulldog-french"
    data.message.forEach(url => {
      expect(url.toLowerCase()).toContain('bulldog-french');
    });
  });

  // TEST 20 : Test de performance - Plusieurs requêtes parallèles
  test('Performance - 10 requêtes d\'images aléatoires en parallèle', async ({ request }) => {
    const startTime = Date.now();
    
    // Créer 10 promesses de requêtes
    const promises = Array(10).fill(null).map(() => 
      request.get(`${BASE_URL}/breeds/image/random`)
    );
    
    // Exécuter toutes les requêtes en parallèle
    const responses = await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Vérifier que toutes les requêtes ont réussi
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // Le temps total devrait être raisonnable (moins de 5 secondes)
    expect(totalTime).toBeLessThan(5000);
    console.log(`10 requêtes parallèles complétées en ${totalTime}ms`);
  });
});

// BONUS : Tests avancés
test.describe('Dog CEO API - Tests Avancés (Bonus)', () => {
  
  test('Validation complète - Chaîne de tests', async ({ request }) => {
    // 1. Récupérer toutes les races
    const breedsResponse = await request.get(`${BASE_URL}/breeds/list/all`);
    const breedsData = await breedsResponse.json();
    const allBreeds = Object.keys(breedsData.message);
    
    // 2. Choisir une race aléatoire
    const randomBreed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
    console.log(`Race testée : ${randomBreed}`);
    
    // 3. Récupérer une image de cette race
    const imageResponse = await request.get(`${BASE_URL}/breed/${randomBreed}/images/random`);
    const imageData = await imageResponse.json();
    
    // 4. Vérifier que l'image correspond bien à la race
    expect(imageResponse.status()).toBe(200);
    expect(imageData.message.toLowerCase()).toContain(randomBreed);
    
    console.log(`Image trouvée : ${imageData.message}`);
  });

  test('Statistiques - Compter les races avec et sans sous-races', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/breeds/list/all`);
    const data = await response.json();
    
    let withSubBreeds = 0;
    let withoutSubBreeds = 0;
    
    Object.values(data.message).forEach(subBreeds => {
      if (subBreeds.length > 0) {
        withSubBreeds++;
      } else {
        withoutSubBreeds++;
      }
    });
    
    console.log(`Races avec sous-races : ${withSubBreeds}`);
    console.log(`Races sans sous-races : ${withoutSubBreeds}`);
    
    expect(withSubBreeds).toBeGreaterThan(0);
    expect(withoutSubBreeds).toBeGreaterThan(0);
  });
});