import { createCookie } from "@remix-run/node";

export const tokenCookie = createCookie("token", {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    maxAge: (1000 * 60 * 60 * 24 * 365),
    secure: process.env.NODE_ENV === "production"
});

export const singUpSessionCookie = createCookie("sing-up-session", {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: (1000 * 60 * 30)
});
