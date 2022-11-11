import { enteredAndErrBg, entryTrueBg, errBg } from "../helpers/constants"

export const returnStyle = (row) => {
    let style;
    if (row.entryStatus && row.errorTask) {
        style = { background: enteredAndErrBg, color: 'white' }
    } else if (row.entryStatus) {
        style = { background: entryTrueBg }
    } else if (row.errorTask) {
        style = { background: errBg }
    }
    if (row.oldDate) {
        if (new Date(row.assignDate).toDateString() != new Date(row.oldDate).toDateString()) {
            style = { ...style, pointerEvents: 'none', background: 'rgba(210, 210, 210, 0.6)', }
        }
    }
    return style;
}