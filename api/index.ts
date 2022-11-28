import axios from 'axios';
import { ICommentData } from '../types/comment';
import { ICreatePostData, IUpdatePostData } from '../types/post';
import { IChangeBlogName, IChangePassword, IUpdateProfileGeneralInformation } from '../types/profile';
import { ILogin, ISingUp, IUser } from '../types/user';

let baseURL = 'http://localhost:3000/api'
let ISSERVER = typeof window === "undefined";
let isFoundUser: string | null = null;
let user: IUser | null = null;

if (!ISSERVER) isFoundUser = localStorage.getItem("user");
if (isFoundUser) user = JSON.parse(isFoundUser);
if (process.env.NODE_ENV === "production" && !ISSERVER) baseURL = `https://${window.location.host}/api`;

const API = axios.create({ baseURL: baseURL })

API.interceptors.request.use((req) => {
    if (user && req.headers) req.headers.authorization = `Bearer ${user.token}`;
    return req
})


export const singUp = async (data: ISingUp) => await API.post(`/auth/sing-up`, data)

export const login = async (data: ILogin) => await API.post("/auth/login", data)

export const Logout = async () => await API.get("/auth/logout")

export const GetToken = async () => await API.get("/auth/refresh-token");

export const GetTagsAndCategories = async () => await API.get("post")

export const createPost = async (data: ICreatePostData) => await API.post("post", data)

export const GetProfileData = async (userId?: string) => await API.get(`/admin/profile?userId=${userId || ""}`);

export const UpdateProfileGeneralInformation = async (data: IUpdateProfileGeneralInformation) => await API.patch("/admin/profile", data)

export const ChangeBlogName = async (data: IChangeBlogName) => await API.put("/admin/profile", data)

export const ChangePassword = async (data: IChangePassword) => await API.patch("/auth/sing-up", data)

export const CreateComment = async (data: ICommentData) => await API.post(`comment`, data);

export const deleteComment = async (id: number) => await API.delete(`comment?id=${id}`)

export const updateComment = async (id: number, content: string) => await API.patch(`comment?id=${id}`, {content: content})

export const likePost = async (slug: string) => await API.patch(`handelPost?type=like&?slug=${slug}`)

export const dislikePost = async (slug: string) => await API.patch(`handelPost?type=dislike&?slug=${slug}`)

export const getBlogDataS = async (blogName: string) => await API.get(`blog?blogName=${blogName}`);

export const getBlogDataHome = async (blogName: string) => await API.get(`blog?blogName=${blogName}&home=true`);

export const getPostsRelated = async (category: string) => await API.put(`blog?category=${category}`);

export const generalSearch = async (query: string) => await API.get(`search?search=${query}`)

export const SearchByTag = async (tag: string) => await API.get(`search?tag=${tag}`)

export const SearchByCategory = async (category: string) => await API.get(`search?category=${category}`)

export const GetPostsPageData = async (skip: number, take: number) => await API.get(`admin/?skip=${skip}&take=${take}`)

export const GetPagesNumber = async () => await API.get(`admin/?length=true`)

export const GetPostToUpdate = async (id: number) => await API.get(`admin/update-post/?id=${id}`)

export const UpdatePost = async (id: number, data: IUpdatePostData) => await API.post(`admin/update-post/?id=${id}`, data)

export const DeletePost = async (id: number) => await API.delete(`post/?id=${id}`)

export const GetLikes = async (id: number) => await API.get(`likes?id=${id}`)

export const GetComments = async (id: number) => await API.get(`comments?id=${id}`)

export const GetPosts = async () => await API.get('handelPost');

export const uploadProfileImage = async (files: File[]) => {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.set(`file${i}`, files[i]) }
    return await API.postForm("/upload", formData)
}

export const viewedPost = async (id: number) => await API.put(`handelPost/?id=${id}`);