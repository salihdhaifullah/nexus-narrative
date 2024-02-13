import { Link } from "react-router-dom"

const Tags = ({ tags }: { tags: { name: string }[] }) => {
    return (
        <div className="flex my-20 gap-1 justify-center items-center">
            {tags.map((item, index) => (
                <Link key={index} to={`/posts/?tag=${item.name}`}>
                    <p className="shadow-lg cursor-pointer text-base text-gray-800">
                        #{item.name}
                    </p>
                </Link>
            ))}
        </div>
    )
}

export default Tags
