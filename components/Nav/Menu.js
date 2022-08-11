import Link from 'next/link'
import {
    Stack,
    Typography
} from "@mui/material"
import { baseURL } from '../../helpers/constants'

const categories = ['attendance', 'tasks', 'employees', 'mark-attendance', 'products']

function Menu() {
    return (
        <Stack
            direction="row"
            alignItems="center"
            height={35}
            sx={{
                background: '#E1304C',
                p: 1,
                display: { xs: "none", md: "flex" }
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
                            '&:hover': {
                                background: 'white',
                                height:30,
                                color:'black'
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
}

export default Menu