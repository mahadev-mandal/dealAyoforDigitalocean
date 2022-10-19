import { absenceBg, halfBg, holidayBg, satBg } from "../helpers/constants"

const returnAttendanceStyle = (row) => {
    if (row.type == 'holiday') {
        return {
            background: holidayBg,
        }
    } else if (row.type == 'saturday' || new Date(row.date).getDay() == 6) {
        return {
            background: satBg
        }
    } else if (row.employees[0].attendanceStatus == 'Absence') {
        return { background: absenceBg }
    } else if (row.employees[0].attendanceStatus == 'Half') {
        return { background: halfBg }
    } else {
        return {
            '&:nth-of-type(odd)': {
                backgroundColor: '#F5F5F5',
            }
        }
    }
}
export default returnAttendanceStyle