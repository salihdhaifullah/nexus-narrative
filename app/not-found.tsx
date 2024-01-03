import Image from 'next/image'
import React from 'react'
import mountains from "public/404.jpg"
import { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
    title: 'Page Not Found | NexusNarrative',
    description: 'Oops! The page you are looking for could not be found. Explore other exciting content on NexusNarrative.',
};

const NotFound = () => {
    return (
        <section className="h-screen w-full">
            <div className='absolute h-screen w-full -z-10 bg-black'>
                <Image
                    alt="Mountains"
                    src={mountains}
                    placeholder="blur"
                    quality={100}
                    fill
                    sizes="100vw"
                    className='object-cover opacity-40'
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
                <h1 className='text-primary text-6xl'>404</h1>
                <h2 className='text-primary text-4xl'>page not found</h2>
                <div className="text-lg text-primary flex-row flex gap-1">
                    <p>
                        Oops! The page you are looking for could not be found. Explore other exciting content on
                    </p>
                    <Link href="/" className="link">NexusNarrative</Link>
                </div>

            </div>
        </section>
    )
}

export default NotFound
