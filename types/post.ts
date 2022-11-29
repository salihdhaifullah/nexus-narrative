export interface ICreatePostData {
    title: string
    content: string
    slug: string
    category: string
    description: string
    images: {
        fileName: string
        base64: string
        preViewUrl: string
    }[]
    tags: string[]
    backgroundImage: {
        fileName: string
        base64: string
    }
};

export interface IUpdatePostData {
    title: string
    content: string
    category: string
    images: {
        fileName: string
        base64: string
        preViewUrl: string
    }[]
    tags: string[]
};


export interface IFeaturedPostProps {
    backgroundImage: string;
    title: string;
    slug: string;
    description: string;
    createdAt: Date;
    author: {
      blogName: string;
    };
}


export interface IBLogProps {
    content: string;
    about: string;
    email: string;
    title: string;
    description: string;
    blogName: string;
    backgroundImage: string;
    name: string;
    AvatarUrl: string;
    createdAt: string;
    tags: {
        name: string;
    }[];
    category: string;
    postId: number;

    id: number;
    slug: string;
    posts: IFeaturedPostProps[];
    PostsRelated: IFeaturedPostProps[];
    authorId: number;
}


export interface IPostProps {
    data: IBLogProps;
}

export type SortByType = "CreateAt" | "Views" | "Likes"
