import { Box, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router"
import useSWR from "swr";
import { baseURL } from "../../helpers/constants";
import fetchData from "../../controllers/fetchData"

function MyProfile() {
    const router = useRouter();
    const { user } = router.query;
    const {
        data,
        error,
    } = useSWR(`${baseURL}/api/employees/${user}`, fetchData)
    const returnField = (d) => {
        if (d == 'status') {
            if (data[d]) {
                return 'Active'
            }
            return 'Disabled'
        } else {
            if (data[d] == '') {
                return '...'
            }
            return data[d]
        }
    }
    if (error) {
        return <div>Error occured while fetching Your details </div>
    } else if (!data) {
        return <div>Loading...</div>
    }
    return (
        <Box>
            <Stack direction="row"
                spacing={10}
                alignItems="center"
                justifyContent="center"
                sx={{ m: 'auto', mt: 1, p: 3 }}
                width="max-content"
                component={Paper}
                elevation={3}
            >
                <Stack alignItems="center" spacing={2}>
                    <Box sx={{ border: '2px solid green' }}>
                        <Image
                            src={data.profilePicPath} alt={data.firstName}
                            width={300}
                            height={350}
                            objectFit="cover"
                        />
                    </Box>
                    <Typography variant="h5">{`${data.firstName} ${data.lastName}`}</Typography>
                </Stack>
                <Stack direction="row" spacing={4}>

                    <Stack spacing={2}>
                        {Object.keys(data).map(d => (
                            <Typography key={d}>{d}</Typography>
                        ))}
                    </Stack>
                    <Stack spacing={2}>
                        {Object.keys(data).map(d => (
                            <Stack key={d} direction="row" spacing={1} color="#2196F3">
                                <Typography >{returnField(d)}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}

export default MyProfile