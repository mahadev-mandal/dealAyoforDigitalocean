import axios from "axios";
import { baseURL } from "../helpers/constants";

const handleDateChange = async (from, to, mutate) => {
    await axios.post(`${baseURL}/api/attendance`, { dateFrom: from, dateTo: to })
        .then(() => {
            mutate();
        }).catch((err) => {
            console.log(err)
        })
}
export default handleDateChange;