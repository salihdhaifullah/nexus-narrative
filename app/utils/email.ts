import * as nodemailer from 'nodemailer';
import { renderToStaticMarkup } from 'react-dom/server';
import ResetPassword from '~/components/utils/emails/ResetPassword';
const email = process.env["email"]
const password = process.env["password"]

if (!email || !password) throw new Error("password or email are not configured");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: password,
    },
});

async function sendMail(to: string, subject: string): Promise<void> {
    await transporter.sendMail({
        from: 'Team@NexusNarrative.com',
        to,
        subject,
        html: renderToStaticMarkup(ResetPassword()),
        priority: 'high'
    });
}

export function verification(to: string, name: string, code: string): void {
    sendMail(to, 'activate your account');
}

export function resetPassword(to: string, name: string, code: string): void {
    sendMail(to, 'reset your password');
}
