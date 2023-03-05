import * as xlsx from "xlsx";

export const getExcel = (sheet) => {
  const book = xlsx.utils.book_new();
  const sales = xlsx.utils.aoa_to_sheet(sheet);
  sales["!cols"] = [{ wpx: 130 }, { wpx: 130 }, { wpx: 100 }];
  xlsx.utils.book_append_sheet(book, sales, "");

  xlsx.writeFile(book, "매출내역.xlsx");
};
