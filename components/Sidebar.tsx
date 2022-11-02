import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image'

const myLoader = (url: string) => url;

interface SidebarProps {
  description: string;
  social: ReadonlyArray<{
    link: string;
    name: string;
  }>;
  title: string;
  email: string;
  name: string;
  AvatarUrl: string;
  authorId: number;
}

export default function Sidebar(props: SidebarProps) {
  const { authorId, description, social, title, email, name, AvatarUrl } = props;

  return (
    <Grid item xs={12} md={4}>


      <div className='inline-flex items-center'>
        <Image
          className='rounded-full'
          loader={() => myLoader(AvatarUrl)}
          src={"me.png"}
          alt="Picture of the author"
          width={80}
          height={80}
        />

        <Link href={`/Profiles/${authorId}`}>
          <Typography className="text-xl link ml-2 text-center">{name}</Typography>
        </Link>
      </div>

      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </Paper>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Social
      </Typography>
      {social.map((network) => (
        <a
          target="_blank"
          href={network.link}
          key={network.name}
          rel="noreferrer"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {network.name === "Linkedin" && (
              <LinkedInIcon className="text-[#0072b1]" />
            ) || network.name === "Twitter" && (
              <TwitterIcon className="text-[#00acee]" />
            ) || network.name === "Youtube" && (
              <YouTubeIcon className="text-[#FF0000]" />
            ) || network.name === "Facebook" && (
              <FacebookIcon className="text-[#3b5998] " />
            ) || network.name === "Instagram" && (
              <InstagramIcon className="text-[#8a3ab9] " />
            ) || network.name === "Github" && (
              <GitHubIcon className="text-[#171515]" />
            )}
            <span className="link">{network.name}</span>
          </Stack>
        </a>
      ))}
      <Typography className="text-lg">
        <div> connect to author |</div>

        {email}</Typography>
    </Grid>
  );
}