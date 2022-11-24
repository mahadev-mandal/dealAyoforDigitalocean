const getAllSatAndHoliday = (data, holidays, emp, dateFrom, dateTo) => {
    let saturdays = [];
    let h = [];
    holidays.forEach(ha => {
        if (emp.workingDays.includes(new Date(ha.date).getDay())) {
            h.push({ ...ha._doc, employees: [{ dealAyoId: emp.dealAyoId }] })
        }

    })

    let holidaysDates = h.map((h) => new Date(h.date).toLocaleDateString());
    let dataDates = data.map(d => new Date(d.date).toLocaleDateString());

    //get all non working and empty days of employee except holidays
    let l = new Date(dateFrom);
    while (l <= new Date(dateTo)) {
        if (new Date(l).toLocaleDateString() > new Date().toLocaleDateString()) {
            break;
        }
        if (dataDates.includes(new Date(l).toLocaleDateString()) ||
            holidaysDates.includes(new Date(l).toLocaleDateString())) {
            let nd = l.setDate(l.getDate() + 1);
            l = new Date(nd)
            continue;
        }

        let day = new Date(l).getDay();
        if (!emp.workingDays.includes(day)) {
            saturdays.push({
                date: l.toLocaleDateString(),
                type: 'saturday',
                details: 'Non working day',
                employees: [
                    {
                        dealAyoId: emp.dealAyoId
                    }
                ]
            })
        } else {
            saturdays.push({
                date: l.toLocaleDateString(),
                employees: [
                    {
                        dealAyoId: emp.dealAyoId
                    }
                ]
            })
        }
        let nd = l.setDate(l.getDate() + 1);
        l = new Date(nd)
    }

    return [...saturdays, ...h];
}
export default getAllSatAndHoliday;