import React from 'react'
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip"
import Link from 'next/link'

const Tags = ({ tags }: { tags: { name: string }[] }) => {
    return (
        <Grid container spacing={4} className="flex my-20 justify-center items-center">
            {tags.map((item, index) => (
                <Link key={index} href={`/search/?tag=${item.name}`}>
                    <Chip label={"#" + item.name} className="mr-1 shadow-lg text-base link" variant="outlined" />
                </Link>
            ))}
        </Grid>
    )
}

export default Tags
