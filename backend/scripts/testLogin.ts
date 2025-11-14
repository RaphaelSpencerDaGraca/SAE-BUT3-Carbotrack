// scripts/testLogin.ts
// @ts-ignore
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../src/models/user'; // adapte si besoin
import {
    TEST_USER_EMAIL,
    TEST_USER_PASSWORD,
    TEST_USER_PSEUDO,
} from './testUserConfig';
// import pool from '../src/config/db';

async function main() {
    console.log('🔐 Test du login avec :', {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        pseudoAttendu: TEST_USER_PSEUDO,
    });

    try {
        console.log('🔎 Récupération de l’utilisateur en BDD...');
        const user = await getUserByEmail(TEST_USER_EMAIL);

        if (!user) {
            console.error(
                `❌ Aucun utilisateur trouvé avec l’email ${TEST_USER_EMAIL}. Lance d’abord "seed:test-user".`,
            );
            return;
        }

        console.log('✅ Utilisateur trouvé :', {
            id: user.id,
            email: user.email,
            pseudo: user.pseudo,
        });

        if (user.pseudo !== TEST_USER_PSEUDO) {
            console.warn(
                `⚠️ Pseudo en BDD (${user.pseudo}) différent de TEST_USER_PSEUDO (${TEST_USER_PSEUDO}).`,
            );
        }

        console.log('🧪 Vérification du mot de passe avec bcryptjs.compare...');
        const isValid = await bcrypt.compare(TEST_USER_PASSWORD, user.password_hash);

        if (!isValid) {
            console.error('❌ Mot de passe INCORRECT pour le test user.');
        } else {
            console.log('✅ Mot de passe CORRECT. La logique de login (hash/compare) fonctionne.');
        }
    } catch (err) {
        console.error('❌ Erreur lors du test de login :', err);
    } finally {
        // await pool.end();
        process.exit(0);
    }
}

main();
