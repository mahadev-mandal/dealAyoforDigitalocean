import axios from "axios";
import { baseURL } from "../helpers/constants";

const handleDateChange = async (params, mutate, mutate2) => {
    return await axios.get(`${baseURL}/api/attendance`, { params })
        .then((res) => {
            mutate();
            mutate2();
            return res
        }).catch((err) => {
            console.log(err)
            throw new Error(err);
        })
}
export default handleDateChange;