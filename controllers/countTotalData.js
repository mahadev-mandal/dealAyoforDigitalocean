import axios from "axios"

const countTotalData = async (url, collectionName) => {
    return await axios.get(url, { params: { collectionName } })
        .then((res) => res.data)
        .catch((err) => { throw new Error(err) })
}
export default countTotalData;