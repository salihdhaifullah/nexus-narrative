import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface MainFeaturedPostProps {
  image: string
  title: string
}

export default function MainFeaturedPost(props: MainFeaturedPostProps) {
  const { image, title } = props;

  return (
    <Paper
    className="min-h-[28vh] min-w-[100vw] max-w-fit sm:min-h-[30vh] lg:min-h-[35vh] relative bg-gray-800 text-white mb-4 bg-cover bg-no-repeat bg-center"
    sx={{ backgroundImage: `url(${image})` }} >
      
      <Box className="absolute top-0 bottom-0 right-0 left-0 bg-[rgb(0,0,0)] opacity-30"/>
      
      <Grid container>
        <Grid item md={6}>
          <Box
          className="relative"
          sx={{ p: { xs: 3, md: 6 }, pr: { md: 0 } }} >
            <Typography component="h1"  variant="h3"  color="inherit" gutterBottom>{title}</Typography>
          </Box>
        </Grid>
      </Grid>

    </Paper>
  );
}