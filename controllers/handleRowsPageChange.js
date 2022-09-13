import axios from "axios"

const handleRowsPageChange = async (url, params, mutate) => {
    return await axios.get(url, { params })
        .then((res) => {
            mutate()
            return res
        }).catch((err) => { throw new Error(err) })
}
export default handleRowsPageChange;