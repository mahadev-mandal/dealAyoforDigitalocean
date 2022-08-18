import jwt from 'jsonwebtoken';

const tokenPayload = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        return decoded
    });
}
export default tokenPayload