import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  typeCalculation: string;
  sales: any[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.sales = [
      {product: 'Bamboo Watch', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Black Watch', lastYearSale: 83, thisYearSale: 9, lastYearProfit: 423132, thisYearProfit: 312122, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Blue Band', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Blue T-Shirt', lastYearSale: 49, thisYearSale: 22, lastYearProfit: 745232, thisYearProfit: 65323, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Brown Purse', lastYearSale: 17, thisYearSale: 79, lastYearProfit: 643242, thisYearProfit: 500332, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Chakra Bracelet', lastYearSale: 52, thisYearSale:  65, lastYearProfit: 421132, thisYearProfit: 150005, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Galaxy Earrings', lastYearSale: 82, thisYearSale: 12, lastYearProfit: 131211, thisYearProfit: 100214, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Game Controller', lastYearSale: 44, thisYearSale: 45, lastYearProfit: 66442, thisYearProfit: 53322, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Gaming Set', lastYearSale: 90, thisYearSale: 56, lastYearProfit: 765442, thisYearProfit: 296232, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342},
      {product: 'Gold Phone Case', lastYearSale: 75, thisYearSale: 54, lastYearProfit: 21212, thisYearProfit: 12533, thisYearProfit1: 43342, thisYearProfit2: 43342, thisYearProfit3: 43342, thisYearProfit4: 43342, thisYearProfit5: 43342}
    ];
  }

  prevPage() {
    this.router.navigate(['steps/forecast']);
  }

  nextPage() {

  }
}
