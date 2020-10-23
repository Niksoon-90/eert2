import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }

  private url = environment.hostURL;

  postUploadFile(fd){
    console.log(fd)
    return this.http.post<any>(this.url + `api/file/upload` , fd, {
      reportProgress: true,
      observe: "events"
    });
  }
}
