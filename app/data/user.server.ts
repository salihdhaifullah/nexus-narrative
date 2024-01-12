import { User } from "@prisma/client"
import { createCookie, json, redirect } from "@remix-run/node"
import { prisma } from "~/db.server"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface ILoginArgs {
  user: User;
  password: string;
}

export const login = async (args: ILoginArgs) => {
    if (!bcrypt.compareSync(args.password, args.user.password)) return json({ error: "password or email is incorrect", validationError: null, data: null }, { status: 400 })

    const fullYear = 1000 * 60 * 60 * 24 * 365;

    const token = jwt.sign({ id: args.user.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

    const cookie = createCookie("token", {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + fullYear),
    });

    return json({
      data: {
        id: args.user.id,
        email: args.user.email,
        lastName: args.user.lastName,
        firstName: args.user.firstName
      }, validationError: null, error: null
    }, { headers: { "Set-Cookie": await cookie.serialize(token) }, status: 200 })
}

export const singUp = async () => {
    await new Promise(r => setTimeout(r, 3000))
    return redirect("/")
}
