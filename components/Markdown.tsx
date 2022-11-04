import * as React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function MarkdownListItem(props: any) {
  return <Box component="li" sx={{ mt: 1, typography: 'body1' }} {...props} />;
}
const h1 = () => {
  return <h1 className="text-2xl"></h1>
}
const options = {
  overrides: {
    h1: {
      component: h1,
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true, variant: 'h6', component: 'h2', className: 'text-2xl',
      },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1',         className: 'text-2xl',
    },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'caption',
        paragraph: true,
        className: 'text-2xl',

      },
    },
    p: {
      component: Typography,
      props: { paragraph: true,
        className: 'text-2xl',
      },
    },
    a: { component: Link },
    li: {
      component: MarkdownListItem,
    },
  },
};

export default function Markdown(props: any) {
  return <ReactMarkdown options={options} {...props} />;
}