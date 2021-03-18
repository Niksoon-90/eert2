import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {StepInfoService} from "../../services/step-info.service";
import {IStepInfoModel} from "../../models/stepInfo.model";

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  forecastingModel: MenuItem[];
  stepInfos: IStepInfoModel
  displayPosition: boolean;
  position: string;

  constructor(
    private stepInfoService: StepInfoService
  ) { }

  ngOnInit() {
    this.stepInfoService.getValue().subscribe(
      res => {
        this.stepInfos = res
      })
    this.forecastingModel = [
      {label: 'Шаг 1', routerLink: 'import'},
      {label: 'Шаг 2', routerLink: 'mathForecast'},
      {label: 'Шаг 3', routerLink: 'forecast'},
      {label: 'Шаг 4', routerLink: 'payment'},
    ];
  }

  showPositionDialog(position: string) {

    this.position = position;
    this.displayPosition = true;
  }
}
