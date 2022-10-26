import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

interface SidebarProps {
  description: string;
  social: ReadonlyArray<{
    link: string;
    name: string;
  }>;
  title: string;
  email: string;
}

export default function Sidebar(props: SidebarProps) {
  const { description, social, title, email } = props;

  return (
    <Grid item xs={12} md={4}>
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
        <Link
          display="block"
          variant="body1"
          href={network.link}
          key={network.name}
          sx={{ mb: 0.5 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {network.name === "Linkedin" && (
              <LinkedInIcon className="text-[#0072b1]"/>
            ) || network.name === "Twitter" && (
              <TwitterIcon className="text-[#00acee]"/>
            ) || network.name === "Youtube" && (
              <YouTubeIcon className="text-[#FF0000]"/>
            ) || network.name === "Facebook" && (
              <FacebookIcon className="text-[#3b5998] "/>
            ) || network.name === "Instagram" && (
              <InstagramIcon className="text-[#8a3ab9] "/>
            ) || network.name === "Github" && (
              <GitHubIcon className="text-[#171515]"/>
            )}
            <span>{network.name}</span>
          </Stack>
        </Link>
      ))}
      <Typography className="text-lg">{email}</Typography>
    </Grid>
  );
}