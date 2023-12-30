export interface ICommentData {
    comment: string;
    postId: number;
}


export interface IComment {
    author: {
        profile: string;
        firstName: string;
        lastName: string;
    }
    authorId: number;
    content: string;
    createdAt: Date;
    id: number;
}