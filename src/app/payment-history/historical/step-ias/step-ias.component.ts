import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ForecastingModelService} from "../../../services/forecasting-model.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-step-ias',
  templateUrl: './step-ias.component.html',
  styleUrls: ['./step-ias.component.scss']
})
export class StepIasComponent implements OnInit {

  sessionId: number
  private subscription: Subscription;
  nameSession: string
  test: any

  constructor(
    private router: Router,
    private forecastModelService: ForecastingModelService,
    private activateRoute: ActivatedRoute,
  ) {
    this.subscription = activateRoute.params.subscribe(params => {
      this.sessionId = params['id'], this.nameSession = params['name']
    });
  }


  ngOnInit(): void {

  }


  prevPage() {
    this.router.navigate(['payments/match/', this.sessionId, this.nameSession]);
    this.forecastModelService.ticketInformation.history.primeryBolChange = false;
  }
}

