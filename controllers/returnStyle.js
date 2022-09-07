import { entryTrueBg, errBg } from "../helpers/constants"

export const returnStyle = (row) => {
    if (row.entryStatus) {
        return { background: entryTrueBg, color:'white' }
    } else if (row.errorTask) {
        return { background: errBg }
    }
    return {}
}