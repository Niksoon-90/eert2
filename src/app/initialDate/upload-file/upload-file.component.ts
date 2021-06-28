import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../services/modal.service";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";
import {CalculationsService} from "../../services/calculations.service";
import {Subscription} from "rxjs";
import {ExportExcelService} from "../../services/export-excel.service";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})


export class UploadFileComponent implements OnInit, OnDestroy {

  @ViewChild('fileUploader') fileUploader: ElementRef;

  @Input() nsi

  @Output() updateSynonym: EventEmitter<string> = new EventEmitter<string>();

  @Output() updateStations: EventEmitter<string> = new EventEmitter<string>();

  uploadFiles: FormGroup
  selectedFile: File = null;
  progress = 0;
  error: '';
  initialDateType: string;
  displayModal: boolean = false;
  cargoTypes: any[];
  user: IAuthModel;
  dimensionLable
  messageDialogStats = ''
  fileId: number = 0;
  test: any[] = []
  subscriptions: Subscription = new Subscription();
  optimalProgressBar: boolean = false
  textOptimal: string
  dimensionItems = [
    {value: 1, label: 'млн. тонн', type: 'MILLION_TONS'},
    {value: 2, label: 'тыс. тонн', type: 'THOUSAND_TONS'},
    {value: 3, label: 'тонн', type: 'TONS'}
  ]
  macroScenarioType = []

  constructor(
    private shipmentsService: ShipmentsService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private calculationsService: CalculationsService,
    private ete: ExportExcelService
  ) {
    this.user = this.authenticationService.userValue;
    this.initialDateType = activateRoute.snapshot.params['initialDateType'];
  }

  ngOnInit(): void {
    if (this.initialDateType === undefined) this.initialDateType = this.nsi
    if (this.initialDateType === 'shipmentsUpload' || this.initialDateType === 'correspondUpload') {
      this.dimensionLable = this.dimensionItems[2]
    }
    if (this.initialDateType === 'cargoUpload') {
      this.dimensionLable = this.dimensionItems[0]
    }
    if (this.initialDateType === 'macroUpload') {
      this.macroScenarioType = [
        {name: 'Базовые значения', type: 'BASE'},
        {name: 'Оптимистичные значения', type: 'OPTIMISTIC'},
        {name: 'Консервативное значения', type: 'PESSIMISTIC'},
      ]
    }
    this.cargoTypes = [
      {id: 1, name: 'Грузоотправитель', type: 'SENDER_CLAIMS'},
      {id: 2, name: 'Грузополучатель', type: 'RECEIVER_CLAIMS'}
    ]
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createForm() {
    this.uploadFiles = this.fb.group({
      nameFile: new FormControl('', [Validators.required, Validators.minLength(1)]),
      dimension: new FormControl(this.dimensionLable, [Validators.required]),
      cargoType: new FormControl('', [Validators.required]),
      macroScenario: new FormControl('', [Validators.required])
    });
  }

  onFileSelected(event) {
    this.selectedFile = (event.target.files[0] as File);
  }

  onUpload() {
    const formData = new FormData()
    formData.append('file', this.selectedFile, this.selectedFile.name);
    if (this.initialDateType === 'shipmentsUpload') {
      this.shipmensUpload(formData, 'SHIPMENTS')
    } else if (this.initialDateType === 'cargoUpload') {
      this.shipmensUpload(formData, this.uploadFiles.value.cargoType.type)
    } else if (this.initialDateType === 'correspondUpload') {
      this.shipmensUpload(formData, 'PERSPECTIVE_CORRESPONDENCES')
    } else if (this.initialDateType === 'macroUpload') {
      this.makroPokUpload(formData)
    } else if (this.initialDateType === 'synonym') {
      this.synonymUpload(formData)
    } else if (this.initialDateType === 'station') {
      this.stationmUpload(formData)
    } else {
      console.log('error onUpload')
    }
  }

  showModalDialog() {
    this.displayModal = true;
  }

  makroPokUpload(formData) {
    this.subscriptions.add(this.shipmentsService.postMacroUploadFile(formData, this.uploadFiles.value.nameFile, this.user.fio, this.user.user,)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(event.loaded / event.total * 100);
        } else if (event.type === HttpEventType.Response) {
        }
      }, error => {
        this.clearForm();
        this.modalService.open(error.error.message)
      }, () => {
        this.clearForm();
        this.showModalDialog();
      }));
  }

  shipmensUpload(formData, type: string) {
    const regex = /\d+/g;
    this.subscriptions.add(this.shipmentsService.postUploadFile(formData, this.uploadFiles.value.nameFile, type, this.user.fio, this.user.user, this.uploadFiles.controls.dimension.value.type)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(event.loaded / event.total * 100);
          } else if (event.type === HttpEventType.Response) {
            if (this.initialDateType === 'shipmentsUpload' || this.initialDateType === 'cargoUpload') {
              this.test = [];
              this.fileId = event.body.message.match(regex);
              let synonym = event.body.loadStats.itemsInFile - event.body.loadStats.itemsGroupedBySynonyms
              this.test.push(event.body.message)
              this.test.push(`Исходный файл содержит: ${event.body.loadStats.itemsInFile} корреспонденций`)
              this.test.push(`После обработки  файла содержит: ${event.body.loadStats.itemsGroupedBySynonyms} корреспонденций`)
              synonym !== 0 ? '' : this.test.push(`Подверглись обработке: ${synonym} корреспонденций`);
            }
          }
        },
        error => {
          this.clearForm();
          let numberStation = []
          if(error.error.invalidStations?.length > 0){
            for(const item in error.error.invalidStations){
              numberStation.push([error.error.invalidStations[item].code, error.error.invalidStations[item].name])
            }
            let reportData = {
                      title: `station`,
                      data: numberStation,
                      headers: ['Код станции', 'Наименование станции']
                    }
                    this.ete.exportExcelStation(reportData);
              this.modalService.open(error.error.message.replace(/[a-z]/g, '').substring(error.error.message.replace(/[a-z]/g, '').indexOf(": [") + 3, error.error.message.replace(/[a-z]/g, '').indexOf("],")))
          }else{
            this.modalService.open(error.error.message)
          }
        }, () => {
            this.clearForm();
            this.showModalDialog();
        }));
  }

  synonymUpload(formData: FormData) {
    this.subscriptions.add(this.shipmentsService.postSynonymUploadFile(formData, this.uploadFiles.value.nameFile, this.user.fio, this.user.user)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(event.loaded / event.total * 100);
        } else if (event.type === HttpEventType.Response) {
        }
      }, error => {
        this.clearForm();
        this.modalService.open(error.error.message)
      }, () => {
        this.updateSynonym.emit('Child');
        this.clearForm();
        this.showModalDialog();
      }));
  }

  stationmUpload(formData: FormData) {
    this.subscriptions.add(this.shipmentsService.postStationploadFile(formData)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(event.loaded / event.total * 100);
        } else if (event.type === HttpEventType.Response) {
        }
      }, error => {
        this.clearForm();
        this.modalService.open(error.error.message)
      }, () => {
        this.updateStations.emit('station');
        this.clearForm();
        this.showModalDialog();
      }));
  }

  clearForm() {
    this.uploadFiles.reset({nameFile: '', dimension: this.dimensionLable, cargoType: ''});
    this.fileUploader.nativeElement.value = null;
    this.progress = 0;
  }

  disInvalidBut() {
    if (this.initialDateType !== 'cargoUpload' && this.initialDateType !== 'macroUpload' && this.initialDateType !== 'synonym' && this.initialDateType !== 'station') {
      if (this.progress > 0 || this.selectedFile === null || this.uploadFiles.controls['dimension'].invalid || this.uploadFiles.controls['nameFile'].invalid) return true
    } else if (this.initialDateType === 'cargoUpload') {
      if (this.progress > 0 || this.selectedFile === null || this.uploadFiles.controls['cargoType'].invalid || this.uploadFiles.controls['dimension'].invalid || this.uploadFiles.controls['nameFile'].invalid) return true
    } else if (this.initialDateType === 'macroUpload') {
      if (this.progress > 0 || this.selectedFile === null) return true
    } else if (this.initialDateType === 'synonym') {
      if (this.progress > 0 || this.selectedFile === null) return true
    } else if (this.initialDateType === 'station') {
      if (this.progress > 0 || this.selectedFile === null) return true
    }
  }

  dimensionDelete() {
    if (this.initialDateType === 'macroUpload' || this.initialDateType === 'synonym' || this.initialDateType === 'station') {
      return false
    } else {
      return true
    }
  }

  downloadAbsentcargo() {
    if (this.fileId !== 0) {
      this.subscriptions.add(this.shipmentsService.getDownloadAbsentcargo(this.fileId).subscribe(
        result => {
          switch (result.type) {
            case HttpEventType.Sent:
              console.log('Request sent!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header received!');
              break;
            case HttpEventType.DownloadProgress:
              const kbLoaded = Math.round(  result.total / result.loaded * 100);
              console.log('result', result);
              console.log('result.total', result.total);
              console.log('result.loaded', result.loaded);
              console.log(`Download in progress! ${kbLoaded}Kb loaded`);
              break;
            case HttpEventType.UploadProgress:
              const kbUploaded = Math.round(result.loaded / 1024);
              console.log(`Upload in progress! ${kbUploaded}Kb loaded`);
              break;
            case HttpEventType.Response:
              let filename: string = 'absentcargo.xlsx'
              let binaryData = [];
              binaryData.push(result.body);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
              downloadLink.setAttribute('download', filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
              return [];
          }
        },
        async (error) => {
          const message = JSON.parse(await error.error.text()).message;
          this.modalService.open(message)
        },
      ))
    }
  }

  Optional() {
    this.textOptimal = 'Поиск наиболее оптимальных прогнозов.. Иерархический прогноз.. '
    this.optimalProgressBar = true;
    this.subscriptions.add(this.calculationsService.postoptimalAndHierarchical(this.fileId).subscribe(
      () => console.log(),
            error => {
              this.modalService.open(error.error.message)
              this.optimalProgressBar = false
            },
            () => {
              this.test.push(`Подобраны наиболее оптимальные прогнозы для корреспонденций`)
              this.test.push(`Применен иерархический прогноз`)
              this.optimalProgressBar = false
              this.clearForm();
              this.showModalDialog();
            }
    ))
  }
}
