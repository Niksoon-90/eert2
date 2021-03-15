import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportExcel(excelData) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('forecast');


    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
        bgColor: { argb: 'FFFFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });


    // Adding Data with Conditional Formatting
    data.forEach(d => {
        worksheet.addRow(d);
      }
    );

    worksheet.getColumn(1).width = 24;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 23;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 20;
    worksheet.addRow([]);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })
  }


  exportExcelOne(excelData){
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const yearSumm = excelData.yearSumm;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('forecast');


    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.font = {
        bold: true,
        size: 14
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
        bgColor: { argb: 'FFFFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });


    // Adding Data with Conditional Formatting
    data.forEach(d => {
        worksheet.addRow(d);
      }
    );

    // Add a row by sparse Array (assign to columns A, E & I)
    var rowValues = [];
    rowValues[6] = 'Сумма';
    for(let i = 0; i < yearSumm.length; i++){
      rowValues[7+i] = yearSumm[i];
    }
    let rowValuesSumm = worksheet.addRow(rowValues);
    rowValuesSumm.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 14
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
        bgColor: { argb: 'FFFFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 27;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 20;
    worksheet.addRow([]);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })
  }
}
