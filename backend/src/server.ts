import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import { testConnection } from './config/db';
import vehiclesRoutes from './routes/vehicles';

const app = express();


app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);

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