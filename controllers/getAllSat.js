const getAllSat = (dateFrom, dateTo, DA) => {
    let saturdays = [];
    let l = new Date(dateFrom);
    const sunHolidayEmp = ['r11'];
    const friHolidayEmp = ['p11']
    while (l <= new Date(dateTo)) {
        if (new Date(l) > new Date()) {
            break;
        }
        if (sunHolidayEmp.includes(DA)) {
            if (new Date(l).getDay() == 0) {
                saturdays.push({
                    date: l.toLocaleDateString(),
                    type: 'saturday',
                    details: 'Sunday',
                    employees: [
                        {
                            dealAyoId: ''
                        }
                    ]
                })
            }
        }
        if (friHolidayEmp.includes(DA)) {
            if (new Date(l).getDay() == 5) {
                saturdays.push({
                    date: l.toLocaleDateString(),
                    type: 'saturday',
                    details: 'Friday',
                    employees: [
                        {
                            dealAyoId: ''
                        }
                    ]
                })
            }
        }
        if (new Date(l).getDay() == 6) {
            saturdays.push({
                date: new Date(l).toLocaleDateString(),
                type: 'saturday',
                details: 'Saturday',
                employees: [
                    {
                        dealAyoId: ''
                    }
                ]
            })
        }
        let nd = l.setDate(l.getDate() + 1);
        l = new Date(nd)
        //dont return saturday which is not in date till now
    }
    return saturdays;
}
export default getAllSat;