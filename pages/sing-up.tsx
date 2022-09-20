import { FormEvent, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from "next/link";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { NextPage } from 'next';
import { useDispatch } from 'react-redux';
import { ISingUp } from '../types/user';
import Swal from 'sweetalert2';
import {singUp} from '../api'


const SingUp: NextPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    await singUp({password: password, name: name, email: email} as ISingUp).then(({data}) => {
      Swal.fire({
        title: 'Sing Up Success',
        html: `<h2>${data.massage}</h2>`,
        color: '#716add',
        background: '#222222',
        position: 'top-end',
        icon: 'success',
        timer: 1500
      })
      sessionStorage.setItem("user", JSON.stringify(data.data))
    }).catch(({response}) =>  {
      Swal.fire("something want wrong", response.data.error, 'error')
    })
    
    setIsLoading(false)
    setName("")
    setPassword("")
    setEmail("")
  };

  return (
    <Container component="main" className='w-full h-full mt-20 flex justify-center items-center'>
      <CssBaseline />
      <Box
        className='rounded-md bg-white shadow-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] p-8 h-full flex justify-center items-center flex-col mt-2'>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            type="email"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="name"
            type="name"
            id="name"
            autoComplete="current-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            type={(isLoading) ? "reset" : "submit"}
            fullWidth
            variant="contained"
            className='mt-3 mb-4 bg-[#1976d2] hover:bg-[#1d81e6] text-white'
          >
            {(isLoading) ? (
            <CircularProgress size={28} className='text-white '/>
            ) : "Sing up"}
          </Button>
          
          <Grid container>
            <Grid item>
                <Link href='login'>
                  <a className='link'>already have an account? Login</a>
                </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SingUp;