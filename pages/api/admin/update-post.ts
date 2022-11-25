import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware';
import { ICreatePostData } from '../../../types/post';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const postId = Number(req.query["id"]);
        if (typeof Number(postId) !== 'number') return res.status(400).json({ massage: "post id Not Find" });

        const data = await prisma.post.findFirst({
            where: {
                id: postId,
            },
            select: {
                content: true,
                slug: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                title: true,
                tags: {
                    select: {
                        name: true,
                    },
                },
                backgroundImage: true,
            },
        });

        return res.status(200).json({ data: data })
    }

    if (req.method === "POST") {

        const { title, content, slug, images, tags, category, backgroundImage }: ICreatePostData = req.body;

        if (title.length <= 8 && slug.length <= 8 && content.length <= 100 && category.length <= 2 && tags.length <= 1 && backgroundImage.length > 10) {
            return res.status(400).json({ massage: "unValid data" });
        }

        const postId = Number(req.query["id"]);
        const TagsQuery = []
        const TagsQueryForDelete = [];
        const imagesToDelete: string[] = [];
        const imagesToDeleteQuery = [];
 
 
        const { error, id } = GetUserIdMiddleware(req);

        if (error) return res.status(400).json({ massage: error });

        if (id === undefined) return res.status(400).json({ massage: "Bad Request" });

        if (typeof Number(postId) !== 'number') return res.status(400).json({ massage: "post id Not Find" });

        const isFound = await prisma.post.findFirst({
            where: {
                authorId: id,
                id: postId,
            },
            select: {
                images: {
                    select: {
                        fileUrl: true,
                    },
                },
                id: true,
                backgroundImage: true,
                tags: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        if (!isFound?.id) return res.status(404).json({ massage: "Not Found Post" });

        const isSlugUnique = await prisma.post.findMany({
            where: {
                slug: slug
            },
            select: {
                id: true
            }
        })

        if (isSlugUnique?.length > 1) return res.status(400).json({ massage: "Bad Request slug is not unique" })
        if (tags && tags.length) {
            for (let tag of tags) {
                TagsQuery.push({
                    where: {
                        name: tag
                    },
                    create: {
                        name: tag
                    }
                })


            }
        }




        if (isFound?.tags && isFound.tags.length) {
            for (let tag of isFound.tags) {
                TagsQueryForDelete.push({
                    name: tag.name
                })
            }
        }



        if (backgroundImage !== isFound.backgroundImage) imagesToDelete.push(isFound.backgroundImage);

        for (let image of isFound.images) {
            if (!content.includes(image.fileUrl)) {
                imagesToDelete.push(image.fileUrl);
                imagesToDeleteQuery.push({
                    fileUrl: image.fileUrl
                })
            }
        }

        for (let imageToDelete of imagesToDelete) {
            const { data: Success, error: errorTwo } = await supabase.storage.from("public").remove([imageToDelete]);
            if (errorTwo) return res.status(500).json({ message: errorTwo });
        }




        await prisma.post.update({
            where: {
                id: postId,
            },

            data: {
                backgroundImage: backgroundImage,
                tags: {
                    deleteMany: TagsQueryForDelete,
                    connectOrCreate: TagsQuery,
                },

                title: title,
                content: content,
                images: {
                    create: images || [],
                    deleteMany: imagesToDeleteQuery,
                },
                category: {
                    connectOrCreate: {
                        where: {
                            name: category
                        },
                        create: {
                            name: category
                        }
                    },
                },
                slug: slug,
            },
            include: {
                tags: true,
                category: true,
                author: true
            },
        })

        return res.status(200).json({ massage: "post Successfully Updated" });

    }
}