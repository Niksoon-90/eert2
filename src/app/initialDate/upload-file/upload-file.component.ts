import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {HttpEventType} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../services/modal.service";

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
  dimensionItems: any;
  cargoTypes: any[];
  disabledButton: boolean;

  constructor(
    private shipmentsService: ShipmentsService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService) {
    this.initialDateType = activateRoute.snapshot.params['initialDateType'];
    this.createForm();
  }

  ngOnInit(): void {
    this.dimensionItems = [
      {id:1, name: 'млн. тонн'},
      {id:2, name: 'тыс. тонн'},
      {id:3, name: 'тонн'}
    ]
    this.cargoTypes = [
      {id:1, name:'Грузоотправитель', type: 'SENDER_CLAIMS'},
      {id:2, name:'Грузополучатель', type: 'RECEIVER_CLAIMS'}
    ]
  }

  createForm(){
    this.uploadFiles = new FormGroup({
      nameFile: new FormControl('', [Validators.required, Validators.minLength(1)]),
      dimension: new FormControl('', [Validators.required]),
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
    console.log(type)
    this.shipmentsService.postUploadFile(formData, this.uploadFiles.value.nameFile, type)
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
    this.uploadFiles.reset({ nameFile: '', dimension: '', cargoType: ''});
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
