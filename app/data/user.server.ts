import { json, redirect } from "@remix-run/node"
import pool, { IDBUser, createContent, createUserX, transaction, userExistsByBlog, userExistsByEmail } from "~/db.server"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cache from "~/cache.server";
import { verificationEmail } from "~/utils/email";
import { singUpSessionCookie, tokenCookie } from "~/cookies.server";
import { LoginSchema, SingUpSchema, SingUpSessionSchema } from "~/dto/auth";
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import sharp from "sharp";
import Storage from "~/utils/supabase";
import { ulid } from "ulid";

export const login = async (args: typeof LoginSchema.type) => {
  const user = await pool.query(`--sql
      SELECT * FROM "user" WHERE "email" = $1;
  `, [args.email]).then(res => res.rows[0] as IDBUser | undefined)

  if (!user) return customResponse({ error: `user with this email ${args.email} dose not exist, please try sing up`, status: 404 })

  if (!bcrypt.compareSync(args.password, user.password_hash)) return customResponse({ error: "password or email is incorrect", status: 400 })

  const fullYear = 1000 * 60 * 60 * 24 * 365;

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

  return customResponse({
    data: {
      id: user.id,
      email: user.email,
      name: user.first_name + " " + user.last_name,
      avatarUrl: user.avatar_url,
      blog: user.blog,
    },
    status: 200,
    cookie: await tokenCookie.serialize(token, { expires: new Date(Date.now() + fullYear) })
  })
}


export const singUp = async (args: typeof SingUpSchema.type) => {
  const isFound = await userExistsByEmail(args.email);
  if (isFound) return customResponse({ status: 400, error: `this account ${args.email} already exist try login` });
  const code = initCode();

  const password = bcrypt.hashSync(args.password, bcrypt.genSaltSync(10));

  const sessionData = { ...args, code, password };
  const thirtyMinuets = 1000 * 60 * 30;
  const uuid = crypto.randomUUID();

  await cache.set(uuid, JSON.stringify(sessionData), { PX: thirtyMinuets });

  await verificationEmail(args.email, `${args.firstName} ${args.lastName}`, code);

  return redirect("/auth/account-verification", {
    headers: { "Set-Cookie": await singUpSessionCookie.serialize(uuid, { expires: new Date(Date.now() + thirtyMinuets) }) }
  })
}


export async function createUser(args: typeof SingUpSessionSchema.type) {
  const isFound = await userExistsByEmail(args.email)
  if (isFound) return customResponse({ status: 400, error: `this account ${args.email} already exist try login` });

  const seed = `${args.firstName}-${args.lastName}`;
  const blog = await generateSlug(seed);
  const avatarUrl = await initAvatarUrl(seed);
  const userId = ulid()
  const contentId = ulid()

  await transaction(async (client) => {
    await createContent({id: contentId, author_id: userId, client})
    await createUserX({id: userId, about_id: contentId,
      blog: blog, avatar_url: avatarUrl, email: args.email,
      first_name: args.firstName, last_name: args.lastName,
      password_hash: args.password, client})
  });

  return redirect("/auth/login")
}

function initCode() {
  const randomBytes = crypto.randomBytes(3);
  const code = parseInt(randomBytes.toString('hex'), 16) % 1000000;

  return code.toString().padStart(6, '0');
}

async function generateSlug(seed: string) {
  const baseSlug = seed
    .toLowerCase()
    .replace(/[^a-z0-9_-\s]/g, '')
    .replace(/[ _-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let isFound = await userExistsByBlog(baseSlug);

  if (!isFound) return baseSlug;

  let count = 1;
  let slug = `${baseSlug}-${count}`

  while (isFound) {
    isFound = await userExistsByBlog(baseSlug);
    count++
    slug = `${baseSlug}-${count}`
  }

  return slug;
}

async function initAvatarUrl(seed: string) {
  const avatar = createAvatar(adventurer, {
    seed: seed + crypto.randomUUID(),
    flip: Math.random() < 0.5,
    size: 200,
    glassesProbability: 40,
    hairProbability: 85
  })

  const webpBuffer = await sharp(await avatar.toArrayBuffer()).toFormat('webp').toBuffer();

  return await Storage.uploadFile(webpBuffer);
}

export interface IResponseObjArgs<T> {
  error?: string
  validationError?: null | Record<string, string | null>;
  status?: number;
  cookie?: string;
  data?: T;
}

export async function customResponse<T = null>(args: IResponseObjArgs<T>) {
  return await json(
    { error: args.error ?? null, validationError: args.validationError ?? null, data: args.data ?? null },
    { status: args.status ?? 200, headers: args.cookie ? { "set-cookie": args.cookie } : undefined }).json()
}
