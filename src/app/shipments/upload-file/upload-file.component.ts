import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {HttpEventType} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  uploadFiles: FormGroup
  selectedFile: File = null;
  progress = 0;
  error: '';

  constructor(private shipmentsService: ShipmentsService) { this.createForm(); }

  ngOnInit(): void {
  }
  createForm(){
    this.uploadFiles = new FormGroup({
      nameFile: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
  }
  onFileSelected(event) {
    this.selectedFile = (event.target.files[0] as File);
  }
  onUpload(){
    const formData = new FormData()
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.shipmentsService.postUploadFile(formData, this.uploadFiles.value.nameFile)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round(event.loaded / event.total * 100);
          // console.log('Прогресс загрузки: ' + Math.round(event.loaded / event.total * 100)  + '%')
        }else if (event.type === HttpEventType.Response){
          this.progress = 0
          this.selectedFile = null;
          this.error = '';
        }
      }, error => {
        this.progress = 0
        this.selectedFile = null;
        this.error = error.message;
      });
  }
}
