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
import { useDispatch, useSelector } from 'react-redux';
import * as actions from "../context/actionsTypes";
import { ISingUp } from '../types/user';
import {singUp} from '../context/actions/userReducer'
import State from '../types/state';


const initValues = {name: "", password: "", email: ""}

const SingUp: NextPage = () => {
  const dispatch = useDispatch();
  const {user, error, massage, loading} = useSelector((state: State) => state);
  const clg = console.log;
  clg(user)
  clg(error)
  clg(massage)
  clg(loading)
  const [userData, setUserData] = useState<ISingUp>(initValues);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await singUp(userData)(dispatch);

    clg(user)
    clg(error)
    clg(massage)
    clg(loading)
    // dispatch({type: actions.SING_UP_USER, payload: userData })
    setUserData(initValues)
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={userData.email}
            onChange={(event) => setUserData({...userData, email: event.target.value})}
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
            value={userData.password}
            onChange={(event) => setUserData({...userData, password: event.target.value})}
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
            value={userData.name}
            onChange={(event) => setUserData({...userData, name: event.target.value})}
          />
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            className='mt-3 mb-4 bg-[#1976d2] hover:bg-[#1d81e6]'
          >
            {loading ? <CircularProgress /> : "Sing up"}
          </Button>
          
          <Grid container>
            <Grid item>
                <Link href='login'>
                  <a className='link'>Don&apos;t have an account? Login</a>
                </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SingUp;