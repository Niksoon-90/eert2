import {Injectable} from '@angular/core';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() {
  }

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
        fgColor: {argb: 'FFFFFF'},
        bgColor: {argb: 'FFFFFF'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
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
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, title + '.xlsx');
    })
  }


  exportExcelOne(excelData) {
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
        fgColor: {argb: 'FFFFFF'},
        bgColor: {argb: 'FFFFFF'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
    });


    // Adding Data with Conditional Formatting
    data.forEach(d => {
        worksheet.addRow(d);
      }
    );

    // Add a row by sparse Array (assign to columns A, E & I)
    var rowValues = [];
    rowValues[6] = 'Сумма';
    for (let i = 0; i < yearSumm.length; i++) {
      rowValues[7 + i] = yearSumm[i];
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
        fgColor: {argb: 'FFFFFF'},
        bgColor: {argb: 'FFFFFF'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
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
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, title + '.xlsx');
    })
  }

  exportExcelTwo(excelData) {


    //Title, Header & Data
    const title = excelData.title;
    const topHeaderInfo = excelData.topHeaderInfo;
    const header = excelData.headers;
    const data = excelData.data;
    const headerRodGr = excelData.headerRodGr;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('forecast');

    // построение first header table
    worksheet.mergeCells([1, 1, 1, headerRodGr.length + 6 + headerRodGr.length]);
    worksheet.getCell(1, 1).value = topHeaderInfo;
    worksheet.getCell(1, 1).style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell(1, 1).style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }
    worksheet.getCell(1, 1).alignment = {horizontal: 'center', vertical: 'middle'};


    // построение two header table
    worksheet.mergeCells('A3:A4');
    worksheet.getCell('A3').value = 'Наименование участка'
    worksheet.getCell('A3').style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell('A3').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('A3').style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }


    worksheet.mergeCells('B3:B4');
    worksheet.getCell('B3').value = 'Год'
    worksheet.getCell('B3').style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell('B3').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('B3').style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }

    worksheet.mergeCells('C3:C4');
    worksheet.getCell('C3').value = 'Длина, км.'
    worksheet.getCell('C3').style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell('C3').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('C3').style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }

    worksheet.mergeCells('D3:D4');
    worksheet.getCell('D3').value = 'ИТОГО'
    worksheet.getCell('D3').style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell('D3').alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell('D3').style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }


    // merge by start row, start column, end row, end column (equivalent to K10:M12)
    worksheet.mergeCells([3, 5, 3, headerRodGr.length + 5])
    worksheet.getCell(3, 5).value = 'К концу участка'
    worksheet.getCell(3, 5).alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell(3, 5).style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell(3, 5).style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }

    for (let i = 0; i < headerRodGr.length; i++) {
      worksheet.getCell(4, 5 + i).value = headerRodGr[i]
      worksheet.getCell(4, 5 + i).alignment = {horizontal: 'center', vertical: 'middle'};
      worksheet.getCell(4, 5 + i).style.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      }
      worksheet.getCell(4, 5 + i).style.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFFFF'},
        bgColor: {argb: 'FFFFFF'}
      }
    }

    worksheet.getCell(4, headerRodGr.length + 5).value = 'ВСЕГО'
    worksheet.getCell(4, headerRodGr.length + 5).alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell(4, headerRodGr.length + 5).style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell(4, headerRodGr.length + 5).style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }


    worksheet.mergeCells([3, headerRodGr.length + 6, 3, headerRodGr.length + 6 + headerRodGr.length])
    worksheet.getCell(3, headerRodGr.length + 6).value = 'К началу участка'
    worksheet.getCell(3, headerRodGr.length + 6).alignment = {horizontal: 'center', vertical: 'middle'};
    worksheet.getCell(3, headerRodGr.length + 6).style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell(3, headerRodGr.length + 6).style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }


    for (let i = 0; i < headerRodGr.length; i++) {
      worksheet.getCell(4, headerRodGr.length + 6 + i).value = headerRodGr[i]
      worksheet.getCell(4, headerRodGr.length + 6 + i).alignment = {horizontal: 'center', vertical: 'middle'};
      worksheet.getCell(4, headerRodGr.length + 6 + i).style.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      }
      worksheet.getCell(4, headerRodGr.length + 6 + i).style.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFFFF'},
        bgColor: {argb: 'FFFFFF'}
      }
    }
    worksheet.getCell(4, headerRodGr.length + 6 + headerRodGr.length).value = 'ВСЕГО'
    worksheet.getCell(4, headerRodGr.length + 6 + headerRodGr.length).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.getCell(4, headerRodGr.length + 6 + headerRodGr.length).style.border = {
      top: {style: 'thin'},
      left: {style: 'thin'},
      bottom: {style: 'thin'},
      right: {style: 'thin'}
    }
    worksheet.getCell(4, headerRodGr.length + 6 + headerRodGr.length).style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    }


    let listDorName = []  // массив дорог
    let dataTrain = []    // массив данных для подсчета
    let numRows = 6       // старт строки с которой вносятся данные
    let indexCol = 0

    for (let i = 0; i < data.length; i++) {
      let lenSumm = 0 // сумма
      // есть ли в массиве дорога
      if (listDorName.includes((data[i].dor_name).trim()) === false) {

        //вставка наименорвание дороги
        listDorName.push((data[i].dor_name).trim())

        //подстановка дороги и применение стилей к стрроке
        var rowValuesDorName = [];
        rowValuesDorName[1] = data[i].dor_name;
        for (let i = 0; i < headerRodGr.length + 5 + headerRodGr.length; i++) {
          rowValuesDorName[2 + i] = '';
        }
        let rowValuesSumm = worksheet.addRow(rowValuesDorName);
        rowValuesSumm.eachCell((cell) => {
          cell.font = {bold: true, size: 14}
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}}
          cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
        })
        if(i !== 0){
          numRows += 1
        }
      }

      // numRows = 7
      if (dataTrain.includes(data[i]) === false) {
        let yearTrainRow = []
        //массив с текущей строкой
        dataTrain = data.filter(el => (el.dor_kod === data[i].dor_kod && el.st1_u === data[i].st1_u  && el.st2_u === data[i].st2_u))


        //добавление годов из массива
        dataTrain.filter(el => yearTrainRow.includes(el.year) === false ? yearTrainRow.push(el.year) : null)


        // подсчет длинны lenSumm (общей)
        let oldSt1_p_nameValue = ''
        let oldSt2_p_nameValue = ''
        let sortDataTrain = []

        //цикл lenSumm (общей)
        for (let i = 0; i < dataTrain.length; i++) {
          if(i === 0){
            lenSumm !== null ? lenSumm += dataTrain[i].len :  lenSumm += 0
            oldSt1_p_nameValue = dataTrain[i].st1_p_name !== null ? (dataTrain[i].st1_p_name).trim() : null
            oldSt2_p_nameValue = dataTrain[i].st2_p_name !== null ? (dataTrain[i].st2_p_name).trim() : null
            sortDataTrain.push(`${oldSt1_p_nameValue}-${oldSt2_p_nameValue}`)
          }else if (sortDataTrain.includes(`${dataTrain[i].st1_p_name !== null ? (dataTrain[i].st1_p_name).trim() : null}-${dataTrain[i].st2_p_name !== null ? (dataTrain[i].st2_p_name).trim() : null}`) === false){
            lenSumm !== null ? lenSumm += dataTrain[i].len :  lenSumm += 0
            oldSt1_p_nameValue = dataTrain[i].st1_p_name !== null ? (dataTrain[i].st1_p_name).trim() : null
            oldSt2_p_nameValue = dataTrain[i].st2_p_name !== null ? (dataTrain[i].st2_p_name).trim() : null
            sortDataTrain.push(`${oldSt1_p_nameValue}-${oldSt2_p_nameValue}`)
          }
        }

        // вставка годов жир + подсчет суммы
        for (let i = 0; i < yearTrainRow.length; i++) {
          let sumNt = 0;
          let sumNo = 0;
          let totalSummAll = 0;

          for (let x = 0; x < dataTrain.length; x++) {
            if (dataTrain[x].year === yearTrainRow[i]) {
              if(dataTrain[x].st1_u_namev !== null ){
                (lenSumm !== null && dataTrain[x].nt !== null)? sumNt += (dataTrain[x].nt * dataTrain[x].len) / (lenSumm === 0 ? 1 : lenSumm) : sumNt += 0;
                (lenSumm !== null && dataTrain[x].no !== null) ? sumNo += (dataTrain[x].no * dataTrain[x].len) / (lenSumm === 0 ? 1 : lenSumm) : sumNt += 0;
              }else{
                (lenSumm !== null && dataTrain[x].nt !== null)? sumNt += dataTrain[x].nt  : sumNt += 0;
                (lenSumm !== null && dataTrain[x].no !== null) ? sumNo += dataTrain[x].no : sumNt += 0;
              }
            }
          }
          totalSummAll += (sumNt + sumNo)

          //вставка шапки с суммой и значениями
          var rowValuesSummGr = [];
          rowValuesSummGr[4] = totalSummAll;
          if (headerRodGr.length === 1) {
            rowValuesSummGr[5] = sumNt
            rowValuesSummGr[6] = sumNt
            rowValuesSummGr[7] = sumNo
            rowValuesSummGr[8] = sumNo

            worksheet.getRow(numRows + i).values = rowValuesSummGr
            worksheet.getCell(numRows + i, 4).style.font = {bold: true, size: 14}
            worksheet.getCell(numRows + i, 4).style.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            }
            worksheet.getCell(numRows + i, 4).style.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'FFFFFF'},
              bgColor: {argb: 'FFFFFF'}
            }
            worksheet.getCell(numRows + i, 5).style.font = {bold: true, size: 14}
            worksheet.getCell(numRows + i, 5).style.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            }
            worksheet.getCell(numRows + i, 5).style.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'FFFFFF'},
              bgColor: {argb: 'FFFFFF'}
            }
            worksheet.getCell(numRows + i, 6).style.font = {bold: true, size: 14}
            worksheet.getCell(numRows + i, 6).style.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            }
            worksheet.getCell(numRows + i, 6).style.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'FFFFFF'},
              bgColor: {argb: 'FFFFFF'}
            }
            worksheet.getCell(numRows + i, 7).style.font = {bold: true, size: 14}
            worksheet.getCell(numRows + i, 7).style.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            }
            worksheet.getCell(numRows + i, 7).style.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'FFFFFF'},
              bgColor: {argb: 'FFFFFF'}
            }
            worksheet.getCell(numRows + i, 8).style.font = {bold: true, size: 14}
            worksheet.getCell(numRows + i, 8).style.border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            }
            worksheet.getCell(numRows + i, 8).style.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {argb: 'FFFFFF'},
              bgColor: {argb: 'FFFFFF'}
            }

          } else if(headerRodGr.length > 1){
            indexCol =  headerRodGr.indexOf(data[i].rod_gr_name)
            if(indexCol === -1) {
              console.log(-1)
            }else{
              rowValuesSummGr[5 + indexCol] = sumNt
              rowValuesSummGr[6 + indexCol] = sumNt
              rowValuesSummGr[7 + indexCol] = sumNo
              rowValuesSummGr[8 + indexCol] = sumNo

              worksheet.getRow(numRows + i).values = rowValuesSummGr
              worksheet.getCell(numRows + i, 4).style.font = {bold: true, size: 14}
              worksheet.getCell(numRows + i, 5 + indexCol).style.font = {bold: true, size: 14}
              worksheet.getCell(numRows + i, 6 + indexCol).style.font = {bold: true, size: 14}
              worksheet.getCell(numRows + i, 7 + indexCol).style.font = {bold: true, size: 14}
              worksheet.getCell(numRows + i, 8 + indexCol).style.font = {bold: true, size: 14}
              worksheet.getCell(numRows + i, 4).style.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
              }
              worksheet.getCell(numRows + i, 5 + indexCol).style.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
              }
              worksheet.getCell(numRows + i, 6 + indexCol).style.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
              }
              worksheet.getCell(numRows + i, 7 + indexCol).style.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
              }
              worksheet.getCell(numRows + i, 8 + indexCol).style.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
              }
              worksheet.getCell(numRows + i, 4).style.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFFFFF'},
                bgColor: {argb: 'FFFFFF'}
              }
              worksheet.getCell(numRows + i, 5 + indexCol).style.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFFFFF'},
                bgColor: {argb: 'FFFFFF'}
              }
              worksheet.getCell(numRows + i, 6 + indexCol).style.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFFFFF'},
                bgColor: {argb: 'FFFFFF'}
              }
              worksheet.getCell(numRows + i, 7 + indexCol).style.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFFFFF'},
                bgColor: {argb: 'FFFFFF'}
              }
              worksheet.getCell(numRows + i, 8 + indexCol).style.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FFFFFF'},
                bgColor: {argb: 'FFFFFF'}
              }
            }
          }

          // вставка годов жир
          worksheet.getCell(numRows + i, 2).value = yearTrainRow[i]
          worksheet.getCell(numRows + i, 2).style.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
          worksheet.getCell(numRows + i, 2).style.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FFFFFF'},
            bgColor: {argb: 'FFFFFF'}
          }
        }

        // A жир объединение колонок
        let unionRow = numRows + yearTrainRow.length - 1
        let nameColA = data[i].st1_u_namev === null  && data[i].st2_u_namev === null ? 'Остальные' : `${data[i].st1_u_namev} - ${data[i].st2_u_namev}`

        // if(numRows !== unionRow){
          worksheet.mergeCells(`A${numRows}:A${unionRow}`);
          worksheet.getCell(numRows, 1).value = `${nameColA}`
          worksheet.getCell(numRows, 1).alignment = {horizontal: 'center', vertical: 'middle'};
          worksheet.getCell(numRows, 1).font = {bold: true, size: 14}
          worksheet.getCell(numRows, 1).style.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
          // вставка длинны
          worksheet.mergeCells(`C${numRows}:C${unionRow}`);
          worksheet.getCell(numRows, 3).value = lenSumm
          worksheet.getCell(numRows, 3).alignment = {horizontal: 'center', vertical: 'middle'};
          worksheet.getCell(numRows, 3).font = {bold: true, size: 14}
          worksheet.getCell(numRows, 3).style.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }

        numRows += dataTrain.length + yearTrainRow.length

        let result = []

        if(headerRodGr.length === 1){
          result.push(
            `${data[i].st1_p_name} - ${data[i].st2_p_name}`,
            data[i].year,
            data[i].len !== null ? data[i].len : 'нет данных',
            data[i].nt + data[i].no !== null ? data[i].nt + data[i].no : 0,
            data[i].nt !== null ? data[i].nt : 0,
            data[i].nt !== null ? data[i].nt : 0,
            data[i].no !== null ? data[i].no : 0,
            data[i].no !== null ? data[i].no : 0,
            )
        }else if (headerRodGr.length > 1){
          result.push(
            `${data[i].st1_p_name} - ${data[i].st2_p_name}`,
            data[i].year,
            data[i].len !== null ? data[i].len : 'нет данных',
            data[i].nt + data[i].no !== null ? data[i].nt + data[i].no : 0,
          )

          for(let i =0; i < headerRodGr.length; i++){
            if(i !== indexCol){
              if(i === headerRodGr.length - 1){
                result.push(data[i].nt !== null ? data[i].nt : 0)
              }else{
                result.push(0)
              }
            }
          }
          result.push(data[i].nt !== null ? data[i].nt : 0)

          for(let i =0; i < headerRodGr.length; i++){
            if(i !== indexCol){
              if(i === headerRodGr.length - 1){
                result.push(data[i].no !== null ? data[i].no : 0)
              }else{
                result.push(0)
              }
            }
          }
          result.push(data[i].no !== null ? data[i].no : 0)
        }

        let rowDataI = worksheet.addRow(result);
        rowDataI.eachCell((cell) => {
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}}
          cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
        });

      } else {
        let result = []
        if(headerRodGr.length === 1){
          result.push(
            `${data[i].st1_p_name} - ${data[i].st2_p_name}`,
            data[i].year,
            data[i].len !== null ? data[i].len : 'нет данных',
            data[i].nt + data[i].no !== null ? data[i].nt + data[i].no : 0,
            data[i].nt !== null ? data[i].nt : 0,
            data[i].nt !== null ? data[i].nt : 0,
            data[i].no !== null ? data[i].no : 0,
            data[i].no !== null ? data[i].no : 0,
          )
        }else if (headerRodGr.length > 1){
          result.push(
            `${data[i].st1_p_name} - ${data[i].st2_p_name}`,
            data[i].year,
            data[i].len !== null ? data[i].len : 'нет данных',
            data[i].nt + data[i].no !== null ? data[i].nt + data[i].no : 0,
          )

          for(let i =0; i < headerRodGr.length; i++){
            if(i !== indexCol){
              if(i === headerRodGr.length - 1){
                result.push(data[i].nt !== null ? data[i].nt : 0)
              }else{
                result.push(0)
              }
            }
          }
          result.push(data[i].nt !== null ? data[i].nt : 0)

          for(let i =0; i < headerRodGr.length; i++){
            if(i !== indexCol){
              if(i === headerRodGr.length - 1){
                result.push(data[i].no !== null ? data[i].no : 0)
              }else{
                result.push(0)
              }
            }
          }
          result.push(data[i].no !== null ? data[i].no : 0)
        }

        let rowDataI = worksheet.addRow(result);
        rowDataI.eachCell((cell) => {
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}}
          cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
        });
      }
    }

    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 8;
    worksheet.getColumn(3).width = 11;
    worksheet.getColumn(4).width = 13;
    worksheet.addRow([]);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, title + '.xlsx');
    })
  }


  testex(datas) {
    const data2 = datas
    const header = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3]
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('forecast2');

    let data = []
    for (let x1 of data2) {
      let x2 = Object.keys(x1);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }


    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.font = {
        bold: true,
        size: 14
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFFFF'},
        bgColor: {argb: 'FFFFFF'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
    });


    for (let item of data) {
      worksheet.addRow(item);
    }
    // // Adding Data with Conditional Formatting
    // data.forEach(d => {
    //     worksheet.addRow(d);
    //   }
    // );

    worksheet.getColumn(1).width = 24;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 23;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 20;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, 'title' + '.xlsx');
    })
  }
}
