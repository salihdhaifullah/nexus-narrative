import { redirect } from "@remix-run/node"
import { prisma } from "~/db.server"

export const login = async () => {
    await new Promise(r => setTimeout(r, 3000))
    return redirect("/")
}

export const singUp = async () => {
    await new Promise(r => setTimeout(r, 3000))
    return redirect("/")
}
