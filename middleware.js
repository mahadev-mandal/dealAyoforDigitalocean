import { NextResponse } from "next/server";


// This function will act as middleware
const middlewareHandler = (req) => {
	// We'll first check if route includes
	// the protected path
	// console.log(req.cookies.get('vercel'))
	// if (req.nextUrl.pathname.startsWith('/api')) {
	// 	return NextResponse.redirect(new URL('/', req.url))
	// }
	// if (req.nextUrl.pathname.startsWith('/dashboard')) {
	// 	return NextResponse.rewrite(new URL('/dashboard/user', req.url))
	// }
	if (req.url.includes("/protected")) {

		// Get the secret from the url params
		const urlParams = new URLSearchParams(req.nextUrl.search);
		const secret = urlParams.get("secret");

		// Check if secret exists, if it does
		// then it must be correct.
		if (secret && secret === "mysecret") {

			// If secret matches we will continue
			// to the protected route.
			return NextResponse.next();

		} else {

			// If the secret doesn't exist or is incorrect
			// we'll redirect to the index (Home) page.
			return NextResponse.redirect("http://localhost:3000/");
		}
	}

	// For all other routes, we won't change anything.
	NextResponse.next();

};
export default middlewareHandler;
