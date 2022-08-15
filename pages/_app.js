import TopNav from '../components/Nav/TopNav'
import '../styles/globals.css'
import PropTypes from 'prop-types'
import Menu from '../components/Nav/Menu'
import { Box } from '@mui/material'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <TopNav />
      <Menu />
      <Box sx={{ pt: 1, px: 3 }}>
        <Component {...pageProps} />
      </Box>
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
}

export default MyApp
