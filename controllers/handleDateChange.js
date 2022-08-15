import axios from "axios";
import { baseURL } from "../helpers/constants";

const handleDateChange = async (from, to, token, mutate) => {
    await axios.post(`${baseURL}/api/attendance`, { dateFrom: from, dateTo: to, token: token })
        .then(() => {
            mutate();
        }).catch((err) => {
            console.log(err)
        })
}
export default handleDateChange;