import * as nodemailer from 'nodemailer';
import formatDate from './formatDate';
import fs from "fs"
import path from "path";
const email = process.env["EMAIL"]
const password = process.env["PASSWORD"]

if (!email || !password) throw new Error("password or email are not configured");

const verificationEmailTemplate = fs.readFileSync(path.resolve(process.cwd(), "./app/assets/emails/verification-email.html")).toString();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: password,
    },
});

async function sendMail(to: string, subject: string, html: string): Promise<void> {
    await transporter.sendMail({
        from: 'Team@NexusNarrative.com',
        to,
        subject,
        html,
        priority: 'high'
    });
}


export async function verificationEmail(to: string, name: string, code: string) {
    const html = verificationEmailTemplate
        .replace("{name}", name)
        .replace("{code}", code)
        .replace("{date}", formatDate(new Date().toUTCString(), true))

    await sendMail(to, 'activate your account', html);
}

// export function resetPassword(to: string, name: string, code: string): void {
//     const html = loadEmail()
//     sendMail(to, 'reset your password', html);
// }
