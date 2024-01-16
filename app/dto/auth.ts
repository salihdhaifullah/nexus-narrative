import Schema from "~/utils/validate"

interface ICodeSchema {
    code: string;
}

export const CodeSchema = new Schema<ICodeSchema>()
    .property("code", (v) => v
        .required("verification code is required")
        .code(6, "un-valid verification code"))


interface ISingUpSessionSchema {
    code: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const SingUpSessionSchema = new Schema<ISingUpSessionSchema>()
    .property("code", (v) => v
        .required("verification code is required")
        .code(6, "un-valid verification code"))
    .property("email", (v) => v
        .required("email is required")
        .email("un-valid email address"))
    .property("password", (v) => v
        .required("password is required")
        .max(200, "max length of password is 200")
        .min(8, "min length of the password is 8"))
    .property("lastName", (v) => v
        .required("lastName is required")
        .max(200, "max length of lastName is 200")
        .min(2, "min length of the lastName is 2"))
    .property("firstName", (v) => v
        .required("firstName is required")
        .max(200, "max length of firstName is 200")
        .min(2, "min length of the password is 2"))


interface ISingUp {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const SingUpSchema = new Schema<ISingUp>()
    .property("email", (v) => v
        .required("email is required")
        .email("un-valid email address"))
    .property("password", (v) => v
        .required("password is required")
        .max(200, "max length of password is 200")
        .min(8, "min length of the password is 8"))
    .property("lastName", (v) => v
        .required("lastName is required")
        .max(200, "max length of lastName is 200")
        .min(2, "min length of the lastName is 2"))
    .property("firstName", (v) => v
        .required("firstName is required")
        .max(200, "max length of firstName is 200")
        .min(2, "min length of the password is 2"))



interface ILoginSchema {
    email: string;
    password: string;
}

export const LoginSchema = new Schema<ILoginSchema>()
    .property("email", (v) => v
        .required("email is required")
        .email("un-valid email address"))
    .property("password", (v) => v
        .required("password is required")
        .max(200, "max length of password is 200")
        .min(8, "min length of the password is 8"))
