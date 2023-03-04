import ViewsChart from '../components/dashboard/ViewsChart'
import Posts from '../components/dashboard/Posts'
import Profile from '../components/dashboard/Profile'
import { GetUserId } from '../utils/auth'
import { GetServerSidePropsContext } from 'next'
import prisma from '../libs/prisma'
import { IUserProfileData } from '../types/profile';
import { IPost } from './../types/post';
import { IViews } from './../types/profile';

const Dashboard = ({ profile, postsTable, views, categories }: { profile: IUserProfileData | null, postsTable: IPost | null, views: IViews[] | null, categories: { name: string }[] }) => {
  return (
    <div className="flex flex-col gap-y-20">
      {profile ? <Profile profile={profile} /> : null}
      {(views && views.length > 0) ? <ViewsChart views={views} /> : null}
      {postsTable ? <Posts postsInit={postsTable} categories={categories} /> : null}
    </div>
  )
}

export default Dashboard;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  // @ts-ignore
  const { id: userId, error } = GetUserId(context.req)

  if (error || typeof userId !== "number") return { notFound: true }

  const [profile, postsTable, views, categories] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: true,
        about: true,
        blogName: true,
        country: true,
        city: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        title: true
      }
    }),
    prisma.user.findFirst({
      where: { id: userId },
      select: {
        blogName: true,
        _count: { select: { posts: true } },
        posts: {
          take: 10,
          select: {
            slug: true,
            _count: { select: { views: true } },
            category: { select: { name: true } },
            title: true,
            id: true,
            createdAt: true,
            likesCount: true,
            dislikesCount: true
          }
        }
      }
    }),
    prisma.views.groupBy({
      by: ["monthAndYear"],
      orderBy: { monthAndYear: "asc" },
      where: { post: { authorId: userId } },
      _count: true
    }),
    prisma.category.findMany({ select: { name: true } })
  ])

  if (!profile) return { notFound: true }

  const props = JSON.parse(JSON.stringify({ profile, postsTable, views, categories }))

  return { props }
}
