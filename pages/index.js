import { Backdrop, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { baseURL } from '../helpers/constants';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [Msg, setMsg] = useState('');
  const [logging, setLogging] = useState(false);

  const login = async (event) => {
    setLogging(true);
    event.preventDefault();
    await axios.post(`${baseURL}/api/login`, { dealAyoId: empId, password: password })
      .then((res) => {
        Cookies.set('token', res.data);
        router.push(`${baseURL}/tasks`)
        setMsg('');
        setLogging(false)
      }).catch((err) => {
        setLogging(false)
        setMsg(err.response.data)
      })
  }
  if (Cookies.get('token')) {
    router.push(`${baseURL}/tasks`)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks management system</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={logging}
      // onClick={handleClose}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress color="secondary" />
          <Typography variant='h6'>Logging In...</Typography>
        </Stack>
      </Backdrop>
      <main className={styles.main}>
        <Paper sx={{
          width: 400,
          padding: 5,
          background: 'rgb(240, 240, 240, 0.5)'
        }}>
          <form onSubmit={e => login(e)}>
            <AccountCircleIcon sx={{ fontSize: 80, m: 'auto', display: 'block' }} /> <br />
            <TextField
              fullWidth
              variant='outlined'
              label="Your id"
              value={empId}
              autoComplete="off"
              onChange={(e) => setEmpId(e.target.value)}
            /> <br /><br />
            <TextField
              fullWidth
              variant='outlined'
              label="Password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br /><br />
            <Button fullWidth variant="outlined" type='submit'>Login</Button><br /><br />
            <Typography color="red">{Msg}</Typography>
          </form>
        </Paper>

      </main>
    </div >
  )
}
