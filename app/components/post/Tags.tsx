import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import Link from 'next/link'

const Tags = ({ tags }: { tags: { name: string }[] }) => {
    return (
        <Grid container spacing={4} className="flex my-20 gap-1 justify-center items-center">
            {tags.map((item, index) => (
                <Link key={index} href={`/posts/?tag=${item.name}`}>
                    <Chip label={"#" + item.name} className="shadow-lg cursor-pointer text-base text-gray-800" variant="outlined" />
                </Link>
            ))}
        </Grid>
    )
}

export default Tags
