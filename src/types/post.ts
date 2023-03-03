export interface ICreatePostData {
    title: string
    content: string
    slug: string
    category: string
    description: string
    images: {
        base64: string
        preViewUrl: string
    }[]
    tags: string[]
    backgroundImage: {
        base64: string
    }
};

export interface IUpdatePostData {
    title: string
    content: string
    category: string
    images: {
        base64: string
        preViewUrl: string
    }[]
    tags: string[]
};


export interface IPostProps {
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
    posts: IPostProps[];
    PostsRelated: IPostProps[];
    authorId: number;
}

export interface IPost {
    blogName: string;
    posts: {
        slug: string
        _count: {
            views: number
        }
        title: string
        id: number
        createAt: Date;
        likes: {
            isLike: boolean
            isDislike: boolean
        }[]
    }[]
}

export type SortByType = "CreateAt" | "Views" | "Likes"
