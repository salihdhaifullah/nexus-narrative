import { createCookie, json, redirect } from "@remix-run/node"
import { prisma } from "~/db.server"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cache from "~/cache.server";
import { verificationEmail } from "~/utils/email";

interface ILoginArgs {
  email: string;
  password: string;
}


interface IResponseArgs {
  error?: string
  validationError?: null | Record<string, string | null>;
  data?: unknown;
  status?: number;
}

class Response {
  error: string | null = null;
  validationError: null | Record<string, string | null> = null;
  data: unknown = null;
  status: number = 200;
  redirect: string | null = null

  constructor(args: IResponseArgs) {
    if (args.error) this.error = args.error;
    if (args.validationError) this.validationError = args.validationError;
    if (args.data) this.data = args.data;
    if (args.status) this.status = args.status;
  }

  send() {
    return json(
      { error: this.error, validationError: this.validationError, data: this.data },
      { status: this.status })
  }
}

export const login = async (args: ILoginArgs) => {
  const user = await prisma.user.findUnique({ where: { email: args.email } });

  if (!user) return json({ error: `user with this email ${args.email} dose not exist, please try sing up`, validationError: null, data: null }, { status: 404 })

  if (!bcrypt.compareSync(args.password, user.password)) return json({ error: "password or email is incorrect", validationError: null, data: null }, { status: 400 })

    const fullYear = 1000 * 60 * 60 * 24 * 365;

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

    const cookie = createCookie("token", {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + fullYear),
    });

    return json({
      data: {
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName
      }, validationError: null, error: null
    }, { headers: { "Set-Cookie": await cookie.serialize(token) }, status: 200 })
}


interface ISingUpArgs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const singUp = async (args: ISingUpArgs) => {
    const isFound = await prisma.user.findUnique({ where: { email: args.email } });
    if (isFound) return new Response({status: 400, error: `this account ${args.email} already exist try login`}).send();
    const code = initCode();
    const time = (1000 * 60 * 30);
    const sessionData = { code, ...args };
    const uuid = crypto.randomUUID();

    await cache.set(uuid, JSON.stringify(sessionData));

    const cookie = createCookie("sing-up-session", {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    await verificationEmail(args.email, `${args.firstName} ${args.lastName}`, code);

    return redirect("/auth/account-verification", {
      headers: { "Set-Cookie": await cookie.serialize(uuid, {expires: new Date(Date.now() + time)}) }
    })
}


function initCode() {
  const randomBytes = crypto.randomBytes(3);
  const code = parseInt(randomBytes.toString('hex'), 16) % 1000000;

  return code.toString().padStart(6, '0');
}
