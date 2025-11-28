// backend/src/services/emailService.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Exportez la fonction sendPasswordResetEmail
export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <div>
                <h2>Réinitialisation de votre mot de passe</h2>
                <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                <a href="${resetLink}">Réinitialiser le mot de passe</a>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
};
