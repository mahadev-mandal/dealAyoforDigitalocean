import axios from "axios";
import { baseURL } from "../helpers/constants";

const handleDateChange = async (params, mutate) => {
    await axios.get(`${baseURL}/api/attendance`, { params })
        .then(() => {
            mutate();
        }).catch((err) => {
            console.log(err)
        })
}
export default handleDateChange;