import axios from "axios";

const handleMutateData = async (url, params, ...mutateFunctions) => {
    return await axios.get(url, { params })
        .then((res) => {
            if (mutateFunctions.length > 0) {
                mutateFunctions.map((mutate) => {
                    mutate();
                })
            }
            return res
        }).catch((err) => {
            console.log(err)
            throw new Error(err);
        })
}
export default handleMutateData;