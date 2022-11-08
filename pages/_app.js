import '../styles/globals.css'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import UserProvider from '../context/UserProvider'
import Nav from '../components/Nav'

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Nav />
      <Box sx={{ pt: 1, px: 3 }}>
        <Component {...pageProps} />
      </Box>
    </UserProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
}

export default MyApp
