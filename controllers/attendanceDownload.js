import * as XLSX from 'xlsx';
import NepaliDate from 'nepali-date-converter'

const attendanceDownload = (data, name) => {
    console.log('kjdjkd')
    let da = data.map((d) => {
        if (d.type == 'holiday' || d.type == 'saturday') {
            return {
                nepaliDate: new NepaliDate(new Date(d.date)).format('ddd, DD MMMM YYYY'),
                date: new Date(d.date).toLocaleDateString(),
                status: d.details,
                entryTime: null,
                exitTime: null,
                late: null,
                earlyLeave: null,
                worked: null,
                breakTime: null,
            }
        } else {
            return {
                nepaliDate: new NepaliDate(new Date(d.date)).format('ddd, DD MMMM YYYY'),
                date: new Date(d.date).toLocaleDateString(),
                status: d.employees[0].attendanceStatus,
                entryTime: d.employees[0].entryTime,
                exitTime: d.employees[0].exitTime,
                late: d.employees[0].late,
                earlyLeave: d.employees[0].earlyLeave,
                worked: d.employees[0].worked,
                breakTime: d.employees[0].breakTime,
            }
        }
    })

    const worksheet = XLSX.utils.json_to_sheet((da));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, name+'.xlsx');
};

export default attendanceDownload