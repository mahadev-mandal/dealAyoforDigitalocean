import { enteredAndErrBg, entryTrueBg, errBg } from "../helpers/constants"

export const returnStyle = (row) => {
    if (row.entryStatus && row.errorTask) {
        return { background: enteredAndErrBg, color: 'white' }
    } else if (row.entryStatus) {
        return { background: entryTrueBg }
    } else if (row.errorTask) {
        return { background: errBg }
    }
    return {}
}