import { enteredAndErrBg, entryTrueBg, errBg } from "../helpers/constants"

export const returnStyleTaskTable = (row, oldDate) => {
    if (new Date(row.assignDate).toDateString() == new Date(oldDate).toDateString()) {
        if (row.entryStatus && row.errorTask) {
            return { background: enteredAndErrBg, color: 'white' }
        } else if (row.entryStatus) {
            return { background: entryTrueBg }
        } else if (row.errorTask) {
            return { background: errBg }
        }
    } else {
        return { pointerEvents: 'none', background:'rgba(210, 210, 210, 0.6)', }
    }
}