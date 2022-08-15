import Cookies from "js-cookie";
import { useRouter } from "next/router"

export function withAuth(WrappedComponent) {
    return async (props) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== "undefined") {
            const Router = useRouter();
            const getToken = Cookies.get('')
            // If there is no access token we redirect to "/" page.
            if (!getToken) {
                Router.replace('/');
                return null
            }
            // If this is an accessToken we just render the component that was passed with all its props
            return <WrappedComponent {...props} />
        }
        // If we are on server, return null
        return null
    }
}

