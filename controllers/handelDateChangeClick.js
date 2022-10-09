
const handleDateChangeClick = (d, df, dt) => {
    const date = new Date();
    let dateFrom;
    let dateTo;
    let activeBtn = d;
    if (d == 'thisWeek') {
        const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
        const commingSat = new Date(date.setDate(new Date(lastSun).getDate() + 6)).setHours(24)
        dateFrom = lastSun;
        dateTo = commingSat;
    } else if (d == 'prevWeek') {
        const prevWeekSun = new Date(date.setDate(date.getDate() - date.getDay() - 7)).setHours(0, 0, 0, 0);
        const prevWeekCommingSat = new Date(date.setDate(new Date(prevWeekSun).getDate() + 6)).setHours(24)
        dateFrom = prevWeekSun;
        dateTo = prevWeekCommingSat;
    } else if (d == 'thisMonth') {
        const thisYear = new Date().getFullYear();
        const thisMonth = new Date().getMonth(); //month starts from 0-11
        dateFrom = new Date(thisYear, thisMonth, 1);
        dateTo = new Date(thisYear, thisMonth + 1, 0);
    } else if (d == 'customDate') {
        dateFrom = new Date(df).setHours(0, 0, 0, 0);
        dateTo = new Date(dt).setHours(24);
    } else {
        dateFrom = new Date().setHours(0, 0, 0, 1);
        dateTo = new Date().setHours(24);
    }
    return { dateFrom, dateTo, activeBtn }
}

export default handleDateChangeClick