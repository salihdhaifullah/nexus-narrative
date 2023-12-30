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
    _count: { comments: number };
    likesCount: number;
    dislikesCount: number;
}


export interface IPost {
    blogName: string;
    _count: {posts: number};
    posts: {
        slug: string
        _count: {
            views: number
        }
        category: { name: string }
        title: string
        id: number
        createAt: Date;
        likesCount: number
        dislikesCount: number
    }[]
}
