import axios from 'axios';
import { ICreatePostData } from '../types/post';
import { IChangeBlogName, IChangePassword, ISocil, IUpdateProfileGeneralInformation } from '../types/profile';
import { ILogin, ISingUp, IUser } from '../types/user';

const API = axios.create({ baseURL: 'http://localhost:3000/api' })

const ISSERVER = typeof window === "undefined";


let isFoundUser: string | null = null;
let user: IUser | null = null;

if (!ISSERVER) isFoundUser = localStorage.getItem("user"); 
if (isFoundUser) user = JSON.parse(isFoundUser);

API.interceptors.request.use((req) => {
    if(user && req?.headers?.authorization) req.headers.authorization = `Bearer ${user.token}`;
    return req
})


export const singUp = async (data: ISingUp) => await API.post(`/auth/singin`, data)

export const login = async (data: ILogin) => await API.post("/auth/login", data)

export const Logout = async () => await API.get("/auth/logout")

export const GetToken = async () => await API.get("/auth/refresh-token");

export const GetTagsAndCategories = async () => await API.get("post")

export const createPost = async (data: ICreatePostData) => await API.post("post", data)

export const GetPostData = async (slug: string) => await API.get(`get-post-data?slug=${slug}`);

export const GetProfileData = async () => await API.get("/admin/profile");

export const UpdateProfileGeneralInformation = async (data: IUpdateProfileGeneralInformation) => await API.patch("/admin/profile", data)

export const ChangeBlogName = async (data: IChangeBlogName) => await API.put("/admin/profile?blogName=true", data)

export const ChangePassword = async (data: IChangePassword) => await API.put("/admin/profile?password=true", data)

export const CreateSocial = async (data: ISocil) => await API.post("/admin/profile", data)