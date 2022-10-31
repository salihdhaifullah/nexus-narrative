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
    backgroundImageUrl: string
}


export interface IFeaturedPostProps {
    backgroundImageUrl: string,
    title: string,
    slug: string,
    createdAt: Date,
    author: {
      blogName: string,
    },
}