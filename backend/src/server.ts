//backend\src\server.ts
import { testConnection } from './config/db';
import app from './app';

const PORT = 3001;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await testConnection();
        console.log('Connecté à PostgreSQL');
    } catch (error) {
        console.error('Erreur de connexion à PostgreSQL:', error);
    }
});