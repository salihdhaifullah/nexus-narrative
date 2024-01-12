import * as nodemailer from 'nodemailer';

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

async function sendMail(to: string, subject: string, html: string): Promise<void> {
    await transporter.sendMail({
        from: 'Team@NexusNarrative.com',
        to,
        subject,
        html,
        priority: 'high'
    });
}

const loadEmail = () => "";
export function verification(to: string, name: string, code: string): void {
    const html = loadEmail()
    sendMail(to, 'activate your account', html);
}

export function resetPassword(to: string, name: string, code: string): void {
    const html = loadEmail()
    sendMail(to, 'reset your password', html);
}
