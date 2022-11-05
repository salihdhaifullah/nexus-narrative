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


export interface IBLogProps {
    content: string;
    about: string;
    socil: {
        name: string;
        link: string;
    }[]
    email: string;
    title: string;
    blogName: string;
    backgroundImageUrl: string;
    name: string;
    AvatarUrl: string;
    createdAt: string;
    tags: {
        name: string;
    }[];
    category: string;
    postId: number;


    slug: string;
    posts: IFeaturedPostProps[];
    PostsRelated: IFeaturedPostProps[];
    authorId: number;
}


export interface IPostProps {
    data: IBLogProps | null;
}

