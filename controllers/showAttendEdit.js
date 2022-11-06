import Cookies from "js-cookie"
import parseJwt from "./parseJwt"

const showAttendEdit = (row, role) => {
    if ((parseJwt(Cookies.get('token')).role == role)) {
        if (row.type == 'saturday' || row.type == 'holiday') {
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}
export default showAttendEdit