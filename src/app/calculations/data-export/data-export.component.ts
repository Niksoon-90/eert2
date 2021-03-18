import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {UploadFileService} from "../../services/upload-file.service";
import {ForecastingModelService} from "../../services/forecasting-model.service";
import {ModalService} from "../../services/modal.service";
import {HttpResponse} from "@angular/common/http";
import {IForecastIASModel} from "../../models/forecastIAS.model";
import {CalculationsService} from "../../services/calculations.service";
import {IAuthModel} from "../../models/auth.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formTwo: FormGroup
  forecastCorrespondence: IForecastIASModel[];
  smallCorrespondence: IForecastIASModel[];
  name: any;
  sessionId: number
  selectedPrimery: any
  user: IAuthModel
  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private uploadFileService: UploadFileService,
    private forecastModelService: ForecastingModelService,
    private modalService: ModalService,
    private calculationsService: CalculationsService
  ) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit(): void {
    this.forecastListIas();
    this.createForm();
    this.selectedPrimery = this.forecastModelService.ticketInformation.stepThree.primeryBolChange;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  prevPage() {
    this.router.navigate(['steps/payment']);
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
    this.subscriptions.add(this.uploadFileService.getDownload(this.sessionId, 'ROAD_TO_ROAD').subscribe(
      (response: HttpResponse<Blob>) => {
      let filename: string = 'report.xlsx'
      let binaryData = [];
      binaryData.push(response.body);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    },
      async (error) => {
        const message = JSON.parse(await error.error.text()).message;
        this.modalService.open(message)
      }
  ))
  }
  forecastListIas(){
    this.subscriptions.add(this.calculationsService.getForcastIas().subscribe(
      res => {
        this.forecastCorrespondence = res;
        this.smallCorrespondence = res;
      },
      error => this.modalService.open(error.error.message)
    ))
  }

  downloadIasRoutes() {
    if(this.form.controls.forecastCorrespondence.invalid){
      this.modalService.open('Укажите форму для загрузки')
    }else{
      this.subscriptions.add(this.uploadFileService.getDownload(this.form.controls.forecastCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
          (response: HttpResponse<Blob>) => {
            let filename: string = 'ias_routes.xlsx'
            let binaryData = [];
            binaryData.push(response.body);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
          },
          async (error) => {
            const message = JSON.parse(await error.error.text()).message;
            this.modalService.open(message)
          }
        ))
      if(this.selectedPrimery === true){
        this.subscriptions.add( this.uploadFileService.getDownload(this.form.controls.smallCorrespondence.value.var_id, 'IAS_ROUTES').subscribe(
          (response: HttpResponse<Blob>) => {
            let filename: string = 'report.xlsx'
            let binaryData = [];
            binaryData.push(response.body);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
          },
          async (error) => {
            const message = JSON.parse(await error.error.text()).message;
            this.modalService.open(message)
          }
        ))
      }
    }
  }
}
