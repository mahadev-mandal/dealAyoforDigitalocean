import axios from "axios";

const fetchData = async (url, params) => {
  return await axios.get(url, { params })
      .then((res) => res.data)
      .catch((err) => {
          throw new Error(err)
      })
}
export default fetchData;