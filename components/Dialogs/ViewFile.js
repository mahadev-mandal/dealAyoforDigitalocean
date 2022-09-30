import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Pagination, Stack } from '@mui/material';
import Image from 'next/image';


function ViewFile({ data, open, onClose, }) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const [numPages, setNumPages] = React.useState(0);
    const [pageNumber, setPageNumber] = React.useState(1);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    if (!data) {
        return ''
    }
    console.log('kjdks')
    const fileType = data.fileName.substr(data.fileName.lastIndexOf('.'))
    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            minWidth: 700
                        },
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {data.fileName} 
                </DialogTitle>
                <Stack alignItems="center" sx={{ mb: 1 }} >
                    <Pagination
                        count={numPages}
                        variant="outlined"
                        color="secondary"
                        onChange={(e, n) => setPageNumber(n)}
                    />
                </Stack>
                <DialogContent>
                    {fileType == '.pdf' ?
                        <Document
                            file={`/uploaded-tasks/${data.fileName}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document> :
                        <Box>
                            <Image
                                src={`/uploaded-tasks/${data.fileName}`}
                                alt={data.fileName}
                                width="100%"
                                height="100%"
                                layout="responsive"
                                objectFit="cover"
                            />
                        </Box>
                    }
                </DialogContent>
                <DialogActions>
                    {/* <Link href={`/uploaded-tasks/${data.fileName}`} sx={{ textDecoration: 'none' }}>
                        <Button variant="outlined">Download</Button>
                    </Link> */}
                    <Button onClick={onClose}>Close</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}

ViewFile.propTypes = {
    data: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default ViewFile