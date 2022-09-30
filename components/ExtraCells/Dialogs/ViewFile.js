import { IconButton } from "@mui/material";
import SeeFileDialog from "../../Dialogs/ViewFile";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';
import { useState } from "react";

function ViewFile({ row }) {
    const [fileDialogOpen, setFileDialogOpen] = useState(false);
    const handleVisibilityClick = () => {
        setFileDialogOpen(true);
    }

    return (
        <>
            {<SeeFileDialog
                open={fileDialogOpen}
                onClose={() => setFileDialogOpen(false)}
                data={row}
            />}
            <IconButton size="small" onClick={handleVisibilityClick}>
                <VisibilityIcon />
            </IconButton>
        </>
    )
}

ViewFile.propTypes = {
    row: PropTypes.object
}

export default ViewFile;