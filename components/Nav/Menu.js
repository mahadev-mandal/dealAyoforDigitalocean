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

const categories = ['tasks', 'attendance', 'worksheet', 'employees', 'products', 'product-update', 'categories'];

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

    const matchUrl = (item) => {
        const pathName = router.pathname;
        let rmvSlash
        if (pathName.indexOf('/', 1) > 1) {
            rmvSlash = pathName.substring(pathName.indexOf('/') + 1, pathName.indexOf('/', 1))
        } else {
            rmvSlash = pathName.replace(/\//g, "")
        }
        if (rmvSlash == item) {
            return true
        } else {
            return false
        }
    }
    if (loggedIn) {
        return (
            <Stack
                direction="row"
                alignItems="center"
                height={35}
                spacing={1}
                sx={{
                    background: '#E1304C',
                    p: containerPadding,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
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
                            textTransform: 'uppercase',
                            background: matchUrl(item) ? 'white' : 'inherit',
                            color: matchUrl(item) ? 'black' : 'white',
                            transition: '0.5s',
                            '&:hover': {
                                background: 'white',
                                color: 'black'
                            }
                        }}
                    >
                        <Link href={`${baseURL}/${item}`}>
                            <a style={{ textDecoration: 'none', padding: '0 25px', }}>
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