export interface ICreatePostData {
    title: string
    content: string
    slug: string
    category: string
    images: {
        name: string
        fileUrl: string
    }[]
    tags: string[]
}