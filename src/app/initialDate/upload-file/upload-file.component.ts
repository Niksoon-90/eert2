import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {HttpEventType} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../services/modal.service";
import {IAuthModel} from "../../models/auth.model";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})


export class UploadFileComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader: ElementRef;

  uploadFiles: FormGroup
  selectedFile: File = null;
  progress = 0;
  error: '';
  initialDateType: string;
  displayModal: boolean = false;
  cargoTypes: any[];
  user: IAuthModel;
  dimensionLable
  dimensionItems = [
    {value:1, label: 'млн. тонн', type: 'MILLION_TONS'},
    {value:2, label: 'тыс. тонн', type: 'THOUSAND_TONS'},
    {value:3, label: 'тонн', type: 'TONS'}
  ]




  constructor(
    private shipmentsService: ShipmentsService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.user = this.authenticationService.userValue;
    this.initialDateType = activateRoute.snapshot.params['initialDateType'];
  }

  ngOnInit(): void {

    if(this.initialDateType === 'shipmentsUpload' || this.initialDateType === 'correspondUpload' ){
      this.dimensionLable = this.dimensionItems[2]
    }
    if(this.initialDateType === 'cargoUpload'){
      this.dimensionLable = this.dimensionItems[0]
    }
    this.cargoTypes = [
      {id:1, name:'Грузоотправитель', type: 'SENDER_CLAIMS'},
      {id:2, name:'Грузополучатель', type: 'RECEIVER_CLAIMS'}
    ]
    this.createForm();
  }

  createForm(){
    this.uploadFiles =  this.fb.group({
      nameFile: new FormControl('', [Validators.required, Validators.minLength(1)]),
      dimension: new FormControl(this.dimensionLable, [Validators.required]),
      cargoType: new FormControl('', [Validators.required])
    });
  }
  onFileSelected(event) {
    this.selectedFile = (event.target.files[0] as File);
  }
  onUpload(){
    const formData = new FormData()
    formData.append('file', this.selectedFile, this.selectedFile.name);
    if(this.initialDateType === 'shipmentsUpload'){
      this.shipmensUpload(formData, 'SHIPMENTS')
    }else if(this.initialDateType === 'cargoUpload'){
      this.shipmensUpload(formData, this.uploadFiles.value.cargoType.type)
    }else if(this.initialDateType === 'correspondUpload'){
      this.shipmensUpload(formData,'PERSPECTIVE_CORRESPONDENCES')
    }else{
     console.log('error onUpload')
    }
  }
  showModalDialog() {
    this.displayModal = true;
  }
  shipmensUpload(formData, type: string){
    // console.log(this.user.fio, this.user.user)
    this.shipmentsService.postUploadFile(formData, this.uploadFiles.value.nameFile, type, this.user.fio, this.user.user, this.uploadFiles.controls.dimension.value.type)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round(event.loaded / event.total * 100);
          // console.log('Прогресс загрузки: ' + Math.round(event.loaded / event.total * 100)  + '%')
        }else if (event.type === HttpEventType.Response){
        }
      }, error => {
        this.clearForm();
        this.modalService.open(error.error.message)
      },() => {
        this.clearForm();
        this.showModalDialog();
      });
  }

  clearForm(){
    this.uploadFiles.reset({ nameFile: '', dimension: this.dimensionLable, cargoType: ''});
    this.fileUploader.nativeElement.value = null;
    this.progress = 0;
  }

  disInvalidBut() {
    if(this.initialDateType !== 'cargoUpload'){
      if(this.progress > 0 || this.selectedFile === null || this.uploadFiles.controls['dimension'].invalid || this.uploadFiles.controls['nameFile'].invalid ) return true
    }else if(this.initialDateType === 'cargoUpload') {
      if(this.progress > 0 || this.selectedFile === null || this.uploadFiles.invalid) return true
    }
  }
}
