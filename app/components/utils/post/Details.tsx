import { Link } from "@remix-run/react";

interface IProps {
  author: {
    blogName: string;
    id: number;
    email: string;
    lastName: string;
    firstName: string;
    profile: string | null;
    about: string | null;
  }
};

export default function Details({ author }: IProps) {

  return (
    <div className="flex justify-center mt-10 w-full h-full">

      <div className="bg-white border border-gray-300 w-fit rounded-md shadow-md h-fit p-4">

        <div className='inline-flex items-center'>
          <img
            className='rounded-full w-20 h-20'
            src={author.profile || '/images/user-placeholder.png'}
            alt="Picture of the author"
          />

          <Link to={`/profiles/${author.id}`}>
            <h2 className="text-xl link ml-2 text-center">{author.firstName + " " + author.lastName}</h2>
          </Link>
        </div>

        {!author.about ? null : (
          <div>
            <p>about</p>
            <p>{author.about}</p>
          </div>
        )}

        <p className="text-lg mt-1">{author.email}</p>
      </div>
    </div>
  );
}
