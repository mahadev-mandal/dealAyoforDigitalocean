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
import parseJwt from '../../controllers/parseJwt'

const categories = [
    {
        title: 'tasks',
        url: `${baseURL}/tasks/${parseJwt(Cookies.get('token'))._id}`
    },
    {
        title: 'attendance',
        url: `${baseURL}/attendance`
    }
]

function UserMenu() {
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
                }}
            >
                {categories.map((category) => (
                <Stack
                    key={category.title}
                    height="100%"
                    alignItems="center"
                    direction="row"
                    color="white"

                    sx={{
                        textTransform: 'uppercase',
                        background: matchUrl(category.title) ? 'white' : 'inherit',
                        color: matchUrl(category.title) ? 'black' : 'white',
                        '&:hover': {
                            background: 'white',
                            color: 'black'
                        }
                    }}
                >
                    <Link href={category.url}>
                        <a style={{ textDecoration: 'none', padding: '0 25px', }}>
                            <Typography variant="subtitle2">{category.title}</Typography>
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

export default UserMenu