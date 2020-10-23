import { Component, OnInit } from '@angular/core';
import {MainService} from "../services/main.service";
import {HttpEventType, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  selectedFile: File = null;
  progress = 0;
  error: '';

  constructor(private mainService: MainService) { }

  ngOnInit(): void {

  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile)
  }
  onUpload(){
    const formData = new FormData()
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.mainService.postUploadFile(formData)
      .subscribe(event => {
        console.log(event)
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round(event.loaded / event.total * 100);
          // console.log('Прогресс загрузки: ' + Math.round(event.loaded / event.total * 100)  + '%')
        }else if (event.type === HttpEventType.Response){
          console.log(event)
          this.progress = 0
          this.selectedFile = null;
          console.log(this.selectedFile)
        }
      }, error => {
        this.progress = 0
        this.selectedFile = null;
        console.log(this.selectedFile)
        this.error = error.message
      })
  }

}
