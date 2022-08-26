import Cookies from "js-cookie";
import { useRouter } from "next/router"
import { useState } from "react";
import { useEffect } from "react";
import parseJwt from '../controllers/parseJwt'

export function withAuth(WrappedComponent) {
    const Abc = (props) => {
        const Router = useRouter();
        
        const [mounted, setMounted] = useState(false)
        useEffect(() => {
            setMounted(true)
        }, [])
        //check if in client or serverside
        if (typeof window !== "undefined") {
            const getToken = Cookies.get('token')
            // If there is no access token we redirect to "/" page.
            if (!getToken) {
                Router.replace('/');
                return null
            } else if (parseJwt(getToken).role === 'data-entry') {
                const dEntryAllowedUrls = ['/tasks/[empid]', '/attendance'];
                if (dEntryAllowedUrls.includes(Router.pathname)) {
                    return mounted && <WrappedComponent {...props} />
                } else {
                    return mounted && <div>404 Error page not found</div>
                }
            }
            // If this is an accessToken we just render the component that was passed with all its props
            return mounted && <WrappedComponent {...props} />
        }
        // If we are on server, return null
        return null
    }
    return Abc
}
