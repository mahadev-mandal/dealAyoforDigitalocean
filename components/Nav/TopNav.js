import { Avatar, Button, Divider, Grid, IconButton, InputBase, Paper, Stack, Tooltip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../assets/images/header-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { baseURL, containerPadding } from "../../helpers/constants";
import Cookies from "js-cookie";
import parseJwt from "../../controllers/parseJwt";
import { useRouter } from "next/router";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState, useEffect } from "react";
import axios from 'axios';

function Logout() {
  const router = useRouter()
  const handleLogout = async () => {
    await axios.post(`${baseURL}/api/logout`)
      .then((res) => {
        if (res.data) {
          Cookies.remove('token')
          router.push(`${baseURL}`)
        }
      }).catch((err) => {
        throw new Error(err);
      })
  }
  return (
    <Button onClick={handleLogout} variant="text" sx={{ height: 20, fontSize: 12 }}>
      Logout
    </Button>
  )
}

function TopNav() {
  const [avatarLetter, setAvatarLetter] = useState('')
  const token = Cookies.get('token')

  const returnFirstLetter = () => {
    if (token) {
      let name = parseJwt(Cookies.get('token')).name;
      name = name.replace(/\s+/g, '');
      setAvatarLetter(name.charAt(0));
    } else {
      setAvatarLetter('')
    }
  }
  useEffect(() => {
    returnFirstLetter()
  }, [token])
  return (
    <Grid container
      alignItems="center"
      columnGap={10}
      sx={{
        background: '#E1304C',
        height: 70,
        p: containerPadding,
      }}
    >
      <Grid item>
        <Stack>
          <Link href="/">
            <a>
              <Image width={200} height={50} src={logo} alt="room finder logo" />
            </a>
          </Link>
        </Stack>
      </Grid>
      <Grid item xs={true}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: { md: 40, xs: 30 },
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="What are you looking for?"
            inputProps={{ "aria-label": "search items" }}

          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
      <Grid item >
        <Stack alignItems="center" >
          <Tooltip
            title={<Logout />}
            componentsProps={{
              tooltip: {
                sx: {
                  background: '#fff',
                  color: '#222',
                  borderRadius: 0,
                  mt: 0,
                  fontSize: 15,
                  boxShadow: '0 0 10px gray',
                  height: '100%',
                },
              },
            }}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{ color: 'white' }}
            >
              <Avatar sx={{ textTransform: 'uppercase', width: 35, height: 35 }}>
                {avatarLetter}
              </Avatar>
              <ArrowDropDownIcon />
            </Stack>
          </Tooltip>


        </Stack>
      </Grid>
    </Grid>
  );
}

export default TopNav;
