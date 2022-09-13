import axios from "axios";
import { baseURL } from "../helpers/constants";

const handleDateChange = async (params, mutate) => {
    return await axios.get(`${baseURL}/api/attendance`, { params })
        .then((res) => {
            mutate();
            return res
        }).catch((err) => {
            console.log(err)
            throw new Error(err);
        })
}
export default handleDateChange;