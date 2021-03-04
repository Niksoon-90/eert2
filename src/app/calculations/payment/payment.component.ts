import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId, IForecastIASModelIdResult, IForecastIASModelIdResults,
  IPathRequest
} from "../../models/forecastIAS.model";
import {CalculationsService} from "../../services/calculations.service";
import {ModalService} from "../../services/modal.service";
import {HttpResponse} from "@angular/common/http";
import {UploadFileService} from "../../services/upload-file.service";
import {ShipmentsService} from "../../services/shipments.service";

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
