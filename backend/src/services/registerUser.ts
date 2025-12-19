import pool from "../config/db";
import { seedUserTransportData } from "./seeds/seedUserTransport";
import { createUserTx } from "../models/user";

export async function registerUserWithOptionalSeed(email: string, passwordHash: string, pseudo: string) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const user = await createUserTx(client, email, passwordHash, pseudo);

        const shouldSeed = process.env.SEED_ON_SIGNUP === "true" && process.env.NODE_ENV !== "production";
        if (shouldSeed) {
            await seedUserTransportData(client, user.id);
        }

        await client.query("COMMIT");
        return user;
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}
