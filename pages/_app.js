import Nav from '../components/Nav/TopNav'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <Nav /> */}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
