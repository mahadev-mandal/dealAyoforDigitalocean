import axios from "axios"

const handleRowsPageChange = async (url, params, mutate) => {
    await axios.get(url, { params })
        .then(() => mutate())
        .catch((err) => { throw new Error(err) })
}
export default handleRowsPageChange;