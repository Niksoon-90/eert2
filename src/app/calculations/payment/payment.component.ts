import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ForecastingModelService} from "../../services/forecasting-model.service";


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {


  constructor(
    private router: Router,
    private forecastModelService: ForecastingModelService
  ) {  }

  ngOnInit(): void { }


  prevPage() {
    this.router.navigate(['steps/forecast']);
    this.forecastModelService.ticketInformation.stepThree.primeryBolChange = false;
  }
}
