import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function MainPost(props: {image: string, title: string }) {
  const { image, title } = props;

  return (
    <Paper
    className="min-h-[30vh] min-w-[80vw] block sm:min-h-[35vh] lg:min-h-[40vh] relative bg-gray-800 text-white mb-4 bg-cover bg-no-repeat bg-center"
    sx={{ backgroundImage: `url(${image})` }} >

      <Box className="absolute top-0 bottom-0 right-0 left-0 bg-[rgb(0,0,0)] opacity-30"/>

      <Grid container>
        <Grid item md={6}>
          <Box
          className="relative"
          sx={{ p: { xs: 3, md: 6 }, pr: { md: 0 } }} >
            <Typography component="h1"  variant="h3" className="text-4xl md:text-5xl"  color="inherit" gutterBottom>{title}</Typography>
          </Box>
        </Grid>
      </Grid>

    </Paper>
  );
}
