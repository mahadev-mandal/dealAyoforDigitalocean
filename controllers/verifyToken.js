import axios from 'axios';
import { baseURL } from '../helpers/constants';

const verifyToken = async () => {
    return await axios.post(`${baseURL}/api/verify-token`)
        .then((res) => res.data)
        .catch((err) => { throw new Error(err) })
}
export default verifyToken;