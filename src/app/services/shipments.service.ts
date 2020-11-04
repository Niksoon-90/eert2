import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs';
import {ISession} from '../models/shipmenst.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) {
  }

  private url = environment.hostURL;

  postUploadFile(fd, fileName: string) {
    return this.http.post<any>(this.url + `api/file/upload?localFileName=${fileName}`, fd, {
      reportProgress: true,
      observe: "events"
    });
  }

  getSession(): Observable<any[]> {
    return this.http.get<any[]>(this.url + `api/session`);
  }
}
