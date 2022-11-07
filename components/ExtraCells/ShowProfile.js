import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { baseURL } from "../../helpers/constants";
import PropTypes from "prop-types";

export default function ShowProfile({ row }) {
    const router = useRouter();
    const handleShow = () => {
        router.push(`${baseURL}/user/${row.dealAyoId}`)
    }
    return (
        <>
            <Button size="small" onClick={handleShow}>show</Button>
        </>
    )
}

ShowProfile.propTypes = {
    row: PropTypes.object,
}