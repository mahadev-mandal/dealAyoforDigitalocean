import Link from 'next/link'
import {
    Stack,
    Typography
} from "@mui/material"
import { baseURL, containerPadding } from '../../helpers/constants'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useState } from 'react'

const categories = ['attendance', 'tasks', 'employees', 'mark-attendance', 'products']

function Menu() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false)
    const checkLoggedIn = () => {
        if (Cookies.get('token')) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }
    useEffect(() => {
        checkLoggedIn();
    })

    if (loggedIn) {
        return (
            <Stack
                direction="row"
                alignItems="center"
                height={35}
                sx={{
                    background: '#E1304C',
                    p: containerPadding,
                }}
            >
                {categories.map((item) => (
                    <Stack
                        key={item}
                        height="100%"
                        alignItems="center"
                        direction="row"
                        color="white"
                        sx={{
                            p: '0 25px',
                            textTransform: 'uppercase',
                            height: 35,
                            ml: 0.2,
                            borderRadius: "0 0 -5px -5px",
                            background: router.pathname === `/${item}` ? 'white' : 'inherit',
                            color: router.pathname === `/${item}` ? 'black' : 'white',
                            '&:hover': {
                                background: 'white',
                                height: 35,
                                color: 'black'
                            }
                        }}
                    >
                        <Link href={`${baseURL}/${item}`}>
                            <a style={{ textDecoration: 'none', }}>
                                <Typography variant="subtitle2">{item}</Typography>
                            </a>
                        </Link>
                    </Stack>
                ))
                }
            </Stack >
        )

    } else {
        return null
    }
}

export default Menu