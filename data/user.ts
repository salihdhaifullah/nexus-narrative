import { prisma } from "~/db.server"

export const Login = async () => {
    await new Promise(r => setTimeout(r, 3000))
    Response.json({ massage: "success" })
}
