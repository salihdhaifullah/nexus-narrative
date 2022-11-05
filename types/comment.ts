export interface ICommentData {
    comment: string;
    postId: number;
}


export interface IComment {
    author: {
        Avter: {
            fileUrl: string;
        }
        firstName: string;
        lastName: string;
    }
    authorId: number;
    content: string;
    createdAt: Date;
    id: number;
}