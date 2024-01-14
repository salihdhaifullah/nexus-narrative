import * as nodemailer from 'nodemailer';
import formatDate from './formatDate';

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


export async function verificationEmail(to: string, name: string, code: string) {
    const html = loadVerificationEmail(code, name)
    await sendMail(to, 'activate your account', html);
}

// export function resetPassword(to: string, name: string, code: string): void {
//     const html = loadEmail()
//     sendMail(to, 'reset your password', html);
// }



const loadVerificationEmail = (code: string, name: string) => {
    return `
        <!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Buegee — account verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 10px 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #CBD18F;
            border: 1px solid #363636;
        }

        .header {
            padding: 10px;
            text-align: center;
            background-color: #E3B448;
            border-radius: 0px 0px 10px 10px;
            color: #3A6B35;
        }

        .content {
            padding: 0px 20px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            color: #363636;
        }

        .message {
            font-size: 18px;
            text-align: center;
            color: #363636;
        }

        .end {
            font-size: 18px;
            color: #3A6B35;
            font-weight: bold;
        }

        .date {
            font-size: 18px;
            color: #3A6B35;
            margin-top: 40px;
        }
    </style>
</head>

<body>
    <div class='container'>
        <div class='header'>
            <h2>Verify your email address</h2>
        </div>
        <div class='content'>
            <p class='title'>Hello, ${name}</p>
            <p class='message'>Thank you for signing up with us.</p>
            <h4 class='title'>Verification code: ${code}</h4>
            <p class='message'>This code will expire after 30 minutes.</p>
            <p class='message'>If you did not sign up with us, please ignore this email.</p>
            <p class='date'>date ${formatDate(new Date().toUTCString())}</p>
            <p class='end'>Sincerely, NexusNarrative Team.<p>
        </div>
    </div>
</body>

</html>
    `
};
