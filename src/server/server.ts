//----------------------------------------
// server.ts
// Point d’entrée du serveur: initialisation des variables d’environnement, test DB et démarrage du GameManager/socket.io.
// [Auteur : Hugo Beaulieu & Frédéric Desrosiers]
//----------------------------------------
import 'dotenv/config' 
import GameManager from './GameManager';
import { dbQueryOne } from './dao/dbConnection';

async function testDb() {
  try {
    const result = await dbQueryOne('SELECT NOW()')
    console.log('[PG] Connexion OK :', result)
  } catch (err) {
    console.error('[PG] Erreur de connexion :', err)
  }
}

testDb()

const gameManager = GameManager.getInstance();
