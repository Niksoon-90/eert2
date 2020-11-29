import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {UploadFileService} from "../../services/upload-file.service";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {ModalService} from "../../services/modal.service";
import {HttpResponse} from "@angular/common/http";
import {IForecastIASModel, IForecastIASModelId} from "../../models/forecastIAS.model";
import {CalculationsService} from "../../services/calculations.service";

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {

  form: FormGroup;
  formTwo: FormGroup
  forecastCorrespondence: IForecastIASModel[];
  smallCorrespondence: IForecastIASModelId[];
  name: any;
  sessionId: number

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private uploadFileService: UploadFileService,
    private forecastModelService: ForecastingModelService,
    private modalService: ModalService,
    private calculationsService: CalculationsService
  ) {
  }

  ngOnInit(): void {
    this.forecastListIas();
    this.createForm();
  }


  prevPage() {
    this.router.navigate(['steps/forecast']);
  }

  createForm() {
    this.sessionId = this.forecastModelService.getTicketInformation().stepOne.Session['id']
    this.form = new FormGroup({
      forecastCorrespondence: new FormControl('', [Validators.required]),
      smallCorrespondence: new FormControl('', [Validators.required])
    })
    this.formTwo = new FormGroup({
      name: new FormControl('', [Validators.required])
    })
  }


  unload() {

  }

  download() {

  }

  downloadRoad() {
    this.uploadFileService.getDownload(this.sessionId, 'ROAD_TO_ROAD').subscribe(
      (response: HttpResponse<Blob>) => {
        console.log(response)
      let filename: string = 'report.xlsx'
      let binaryData = [];
      binaryData.push(response.body);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    },
      error => this.modalService.open(error.error.message)
  )
  }
  forecastListIas(){
    this.calculationsService.getForcastIas().subscribe(
      res => this.forecastCorrespondence = res,
      error => this.modalService.open(error.error.message)
    )
  }
  forecastListIasId(id: number){
    this.calculationsService.getForcastIasId(id).subscribe(
      res => this.smallCorrespondence = res,
      error => this.modalService.open(error.error.message)
    )
  }
}
