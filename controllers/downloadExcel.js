import * as XLSX from 'xlsx';

const downloadExcel = (data) => {
    const da = data.map((d) => {
        return {
            _id: d._id,
            title: d.title,
            model: d.model,
            brand: d.brand,
            supplier: d.supplier,
            MRP: d.MRP,
            assignDate: d.assignDate,
            assignToDealAyoId: d.assignToDealAyoId,
            assignToName: d.assignToName,
            entryStatus: d.entryStatus,
            entryDate: d.entryDate,
            errorTask: d.errorTask,
            remarks: d.remarks,
        }
    })

    const worksheet = XLSX.utils.json_to_sheet((da));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "TasksByDealAyo.xlsx");
};

export default downloadExcel