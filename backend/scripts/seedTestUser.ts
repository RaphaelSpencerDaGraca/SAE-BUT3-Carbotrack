// scripts/seedTestUser.ts
// @ts-ignore
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../src/models/user'; // adapte si besoin
import {
    TEST_USER_EMAIL,
    TEST_USER_PASSWORD,
    TEST_USER_PSEUDO,
} from './testUserConfig';
// import pool from '../src/config/db'; // si tu veux fermer le pool

async function main() {
    console.log('ℹ️ User de test configuré avec :', {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        pseudo: TEST_USER_PSEUDO,
    });

    try {
        console.log('🔎 Vérification de la présence de l’utilisateur de test...');

        const existing = await getUserByEmail(TEST_USER_EMAIL);
        if (existing) {
            console.log(`✅ L’utilisateur ${TEST_USER_EMAIL} existe déjà (id=${existing.id}).`);
            console.log('   Pseudo en BDD :', existing.pseudo);

            if (existing.pseudo !== TEST_USER_PSEUDO) {
                console.warn(
                    `⚠️ Pseudo BDD (${existing.pseudo}) différent de TEST_USER_PSEUDO (${TEST_USER_PSEUDO}).`,
                );
            }

            return;
        }

        console.log('🧂 Hash du mot de passe avec bcryptjs...');
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(TEST_USER_PASSWORD, saltRounds);

        console.log('🧪 Création de l’utilisateur de test...');
        createUser(TEST_USER_EMAIL, passwordHash, TEST_USER_PSEUDO);

        console.log('✅ Utilisateur créé avec succès :');

        console.log('🔁 Vérification en rechargant l’utilisateur depuis la BDD...');
        const check = await getUserByEmail(TEST_USER_EMAIL);

        if (!check) {
            console.error('❌ Impossible de retrouver le test user après création !');
        } else {
            console.log('✅ Test user trouvé :');

            //if (check.pseudo !== TEST_USER_PSEUDO) {
            //    console.warn(
            //        `⚠️ Pseudo BDD (${check.pseudo}) différent de TEST_USER_PSEUDO (${TEST_USER_PSEUDO}).`,
            //    );
            //}
        }
    } catch (err) {
        console.error('❌ Erreur lors de la création / vérification de l’utilisateur de test :', err);
    } finally {
        // await pool.end();
        process.exit(0);
    }
}

main();
