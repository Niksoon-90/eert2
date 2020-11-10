import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mathematical-forecast-table',
  templateUrl: './mathematical-forecast-table.component.html',
  styleUrls: ['./mathematical-forecast-table.component.scss']
})
export class MathematicalForecastTableComponent implements OnInit {
  @Input() mathematicalForecastTable;
  loading: boolean;

  constructor() { }

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


}
