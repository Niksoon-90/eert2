import {Component, DoCheck, Input, OnChanges, OnInit} from '@angular/core';


@Component({
  selector: 'app-mathematical-forecast-table',
  templateUrl: './mathematical-forecast-table.component.html',
  styleUrls: ['./mathematical-forecast-table.component.scss']
})
export class MathematicalForecastTableComponent implements OnInit, OnChanges {
  @Input() mathematicalForecastTable;
  loading: boolean;
  totalRecords: number;
  virtualMathematicalForecastTable: [];

  constructor() { }

  ngOnChanges(){
    this.totalRecords = this.mathematicalForecastTable.length;
    this.virtualMathematicalForecastTable = this.mathematicalForecastTable;
  }
  ngOnInit(): void {

  }


  onRowEditInit(product: any) {
    console.log(product)
  }

  onRowEditSave(product: any) {
    console.log(product)
  }

  onRowEditCancel(product: any, ri: any) {
    console.log(product)
  }


  loadCustomers($event: any) {
    console.log($event)
    this.loading = true;
    if($event.sortField) {
      this.virtualMathematicalForecastTable.sort((data1: string, data2: string) => {
        let value1 = data1[$event.sortField];
        let value2 = data2[$event.sortField];
        let result = null;
        console.log(data1[$event.sortField])
        if (value1 == null && value2 != null)
          result = -1;
        else if (value1 != null && value2 == null)
          result = 1;
        else if (value1 == null && value2 == null)
          result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
        else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
        return ($event.sortOrder * result);
      });
    }
    setTimeout(() => {
      if (this.virtualMathematicalForecastTable) {
        this.mathematicalForecastTable = this.virtualMathematicalForecastTable.slice($event.first, ($event.first + $event.rows));

        this.loading = false;
      }
    }, 1000);
  }

}
