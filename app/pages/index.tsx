import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FaArrowRight } from "react-icons/fa"
import mountains from "public/hero.jpg"

export const meta: MetaFunction = () => {
  return [
    { title: 'Explore Engaging Blog Posts on Technology, Lifestyle, Travel, and Health | NexusNarrative' },
    { name: "description", content: 'Explore engaging blog posts on technology, lifestyle, travel, and health. Stay informed and inspired with NexusNarrative.' }
  ];
};

export default function Index() {
  return (
    <section className="h-screen w-full">
      <div className='absolute h-screen w-full -z-10 bg-black'>
        <img
          alt="Mountains"
          src={mountains}
          sizes="100vw"
          className='object-cover opacity-40'
        />
      </div>

      <div className="flex flex-col justify-center items-center h-full w-full place-self-center p-4">
        <h1 className="mb-4 max-w-2xl text-center text-4xl font-extrabold text-secondary leading-none md:text-5xl xl:text-6xl">Welcome to NexusNarrative</h1>
        <p className="mb-6 max-w-2xl text-center text-secondary lg:mb-8 md:text-lg lg:text-xl">Explore a world of engaging blog posts covering diverse topics such as technology, lifestyle, travel, and health. At NexusNarrative, we curate informative and inspirational content to keep you informed and inspired. Join us on a journey of discovery and enrich your online experience with our thought-provoking narratives.</p>

        <div className="flex flex-row gap-2">
          <Link to="/auth/sing-up" className="flex flex-row shadow-md justify-center items-center py-3 px-5 text-base font-semibold text-center text-secondary rounded-lg border border-secondary hover:bg-gray-300">
            Get started
            <FaArrowRight className="text-xs ml-2" />
          </Link>
        </div>
      </div>

    </section>
  );
}
