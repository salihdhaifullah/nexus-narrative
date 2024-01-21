import { redirect } from "@remix-run/node";
import { tokenCookie } from "~/cookies.server";

export async function action() {
    return redirect("/", { headers: { "set-cookie": await tokenCookie.serialize("", { expires: new Date(0) }) } })
}
