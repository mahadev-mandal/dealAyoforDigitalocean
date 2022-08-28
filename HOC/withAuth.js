import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import { baseURL } from "../helpers/constants";

export function withAuth(WrappedComponent) {
    const Abc = (props) => {
        const router = useRouter();
        const [verified, setVerified] = useState(false);
        const [role, setRole] = useState(null);

        useEffect(() => {
            const accessToken = Cookies.get('token');
            const verifyToken = async () => {
                return await axios.post(`${baseURL}/api/verify-token`)
                    .then((res) => {
                        if (!res.data) {
                            setVerified(false)
                            Cookies.remove('token')
                        } else {
                            setRole(res.data.role)
                            setVerified(true)
                        }
                    })
                    .catch((err) => { throw new Error(err) })
            }

            if (!accessToken) {
                router.replace('/');
            } else {
                verifyToken();
            }
        }, [])

        if (verified) {
            if (role === 'data-entry') {
                const dEntryAllowedUrls = ['/tasks/[empid]', '/attendance'];
                if (dEntryAllowedUrls.includes(router.pathname)) {
                    return <WrappedComponent {...props} />
                } else {
                    return <div>404 Error page not found</div>
                }
            }
            return <WrappedComponent {...props} />
        } else {
            return null
        }
    }
    return Abc
}









// import Cookies from "js-cookie";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import { useEffect } from "react";
// import parseJwt from '../controllers/parseJwt';
// import axios from 'axios';
// import { baseURL } from "../helpers/constants";

// export function withAuth(WrappedComponent) {
//     const Abc = (props) => {
//         const router = useRouter();
//         const [verified, setVerified] = useState(false);

//         const [mounted, setMounted] = useState(false)
//         useEffect(() => {
//             setMounted(true)
//         }, [])
//         //check if in client or serverside
//         if (typeof window !== "undefined") {
//             const getToken = Cookies.get('token')
//             // If there is no access token we redirect to "/" page.
//             if (!getToken) {
//                 router.replace('/');
//                 return null
//             } else if (parseJwt(getToken).role === 'data-entry') {
//                 const dEntryAllowedUrls = ['/tasks/[empid]', '/attendance'];
//                 if (dEntryAllowedUrls.includes(router.pathname)) {
//                     return mounted && <WrappedComponent {...props} />
//                 } else {
//                     return mounted && <div>404 Error page not found</div>
//                 }
//             }
//             // If this is an accessToken we just render the component that was passed with all its props
//             return mounted && <WrappedComponent {...props} />
//         }
//         // If we are on server, return null
//         return null
//     }
//     return Abc
// }
