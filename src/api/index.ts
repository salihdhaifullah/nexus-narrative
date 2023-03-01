import axios from 'axios';
import { ICommentData } from '../types/comment';
import { ICreatePostData, IUpdatePostData, SortByType } from '../types/post';
import { IChangeBlogName, IChangePassword, IUpdateProfileGeneralInformation, IUploadAvatar } from '../types/profile';
import { ILogin, ISingUp } from '../types/user';

let baseURL = 'http://localhost:3000/api'
let ISSERVER = typeof window === "undefined";

if (process.env.NODE_ENV === "production" && !ISSERVER) baseURL = `https://${window.location.host}/api`;

const API = axios.create({ baseURL: baseURL })

export const singUp = async (data: ISingUp) => await API.post(`/auth/sing-up`, data)

export const login = async (data: ILogin) => await API.post("/auth/login", data)

export const Logout = async () => await API.get("/auth/logout")

export const GetTagsAndCategories = async () => await API.get(`/helper?create-post=${true}`)

export const createPost = async (data: ICreatePostData) => await API.post("/post", data)

export const GetProfileData = async (userId?: string) => await API.get(`/admin/profile?userId=${userId || ""}`);

export const UpdateProfileGeneralInformation = async (data: IUpdateProfileGeneralInformation) => await API.patch("/admin/profile", data)

export const ChangeBlogName = async (data: IChangeBlogName) => await API.put("/admin/profile", data)

export const ChangePassword = async (data: IChangePassword) => await API.patch("/auth/sing-up", data)

export const CreateComment = async (data: ICommentData) => await API.post(`/comment`, data);

export const deleteComment = async (id: number) => await API.delete(`/comment?id=${id}`)

export const updateComment = async (id: number, content: string) => await API.patch(`/comment?id=${id}`, {content: content})

export const likePost = async (id: number) => await API.patch(`/likes?type=like&id=${id}`)

export const dislikePost = async (id: number) => await API.patch(`/likes?type=dislike&id=${id}`)

export const generalSearch = async (search: string, skip: number, take: number) => await API.get(`/search?search=${search}&skip=${skip}&take=${take}`)

export const SearchByTag = async (tag: string, skip: number, take: number) => await API.get(`/search?tag=${tag}&skip=${skip}&take=${take}`)

export const SearchByCategory = async (category: string, skip: number, take: number) => await API.get(`/search?category=${category}&skip=${skip}&take=${take}`)

export const GetSearchLength = async (type: "category" | "tag" | "search", value: string) => await API.get(`/search?${type}=${value}&get-length=${true}`)

export const GetPostsPageData = async (skip: number, take: number) => await API.get(`/admin/?skip=${skip}&take=${take}`)

export const GetPagesNumber = async () => await API.get(`/admin/?length=true`)

export const GetPostToUpdate = async (id: number) => await API.get(`/admin/update-post/?id=${id}`)

export const UpdatePost = async (id: number, data: IUpdatePostData) => await API.post(`/admin/update-post/?id=${id}`, data)

export const DeletePost = async (id: number) => await API.delete(`/post/?id=${id}`)

export const GetLikes = async (id: number) => await API.get(`/likes?id=${id}`)

export const GetComments = async (id: number) => await API.get(`/comment?id=${id}`)

export const GetPostsLength = async (category: string | undefined) =>
await API.get(`/post/${category ? `?category=${category}&` : "?"}length=${true}`);

export const GetPosts = async (skip: number, take: number, category: string | undefined, sort: SortByType | undefined) =>
await API.get(`/post/${category ? `?category=${category}&` : "?"}skip=${skip}&take=${take}&sort=${sort}`);

export const uploadProfileImage = async (data: IUploadAvatar) => await API.post("/upload", data)

export const viewedPost = async (id: number) => await API.get(`/views/?id=${id}`);

export const GetBlogPosts = async (blogName: string) => await API.get(`/blog?blog-name=${blogName}`)

export const GetViewsChart = async () => await API.get("/admin/dashboard")

export const demoAccount = async () => await API.get("/auth/demo")
