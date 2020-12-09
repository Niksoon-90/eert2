import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs';
import {ISession, IShipment} from '../models/shipmenst.model';
import {IMacroPokModel} from "../models/macroPok.model";
import {ICalculatingPredictiveRegression, ICargoGroupNci, IShipmentTypNci} from "../models/calculations.model";

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(private http: HttpClient) {
  }

  private url = environment.hostURL;

  postUploadFile(fd, fileName: string, type: string, fio: string, login: string, dimension: string) {
    return this.http.post<any>(this.url + `api/file/upload?dimension=${dimension}&fileType=${type}&name=${fileName}&userFio=${fio}&userLogin=${login}`, fd, {
      reportProgress: true,
      observe: "events"
    });
  }

  getShipSession(): Observable<ISession[]> {
      return this.http.get<ISession[]>(this.url + `api/file/list?fileType=SHIPMENTS`);
  }

  deleteShipSession(id: number) {
    return this.http.delete(this.url + `api/session/${id}`)
  }

  getShipments(id: number): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.url + `api/file/shipments?sessionId=${id}`)
  }

  getMacroPok(): Observable<IMacroPokModel[]> {
    return this.http.get<IMacroPokModel[]>(this.url + `api/macroPok/all`)
  }

  postMacroPok(macroPok: IMacroPokModel) {
    return this.http.post(this.url + `api/macroPok`, macroPok)
  }

  putMacroPok(macroPok: IMacroPokModel) {
    return this.http.put(this.url + `api/macroPok`, macroPok)
  }

  deleteMackPok(id: number) {
    return this.http.delete(this.url + `api/macroPok/${id}`)
  }

  getClaimSession(type: string): Observable<ISession[]> {
    return this.http.get<ISession[]>(this.url + `api/file/list?fileType=${type}`)
  }

  getCorrespondenceSession(): Observable<ISession[]> {
    return this.http.get<ISession[]>(this.url + `api/file/list?fileType=PERSPECTIVE_CORRESPONDENCES`)
  }

  putShipments(shipments: ICalculatingPredictiveRegression) {
    return this.http.put(this.url + 'api/file/shipments', shipments)
  }

  getTest(id: number, calculated: any[]): Observable<IShipment> {
    return this.http.put<IShipment>(this.url + `api/file/shipments/${id}`, calculated)
  }
  //TODO Обновить признак 'Готово для ИАС Маршруты'
  putTransformFile(id: number, isReadyToTransfer: boolean){
    return this.http.put(this.url + `/api/file/${id}?isReadyToTransfer=${isReadyToTransfer}`, {})
  }
  //TODO cargo Type
  putDictionaryCargo(cargoGroupNci: ICargoGroupNci){
    return this.http.put(this.url + `api/dictionary/cargo`, cargoGroupNci)
  }
  deleteDictionaryCargo(id: number){
    return this.http.delete(this.url + `api/dictionary/cargo/${id}`)
  }
  getDictionaryCargo(): Observable<ICargoGroupNci[]>{
    return this.http.get<ICargoGroupNci[]>(this.url + `api/dictionary/cargo/all`)
  }
  postDictionaryCargo(name: string){
    return this.http.post(this.url + `api/dictionary/cargo/group/${name}`, {})
  }
  //TODO Shipment type
  putDictionaryShipmenttype(dictionaryShipmenttype: IShipmentTypNci){
    return this.http.put(this.url + `api/dictionary/shipmenttype`, dictionaryShipmenttype)
  }
  deleteDictionaryShipmenttype(id: number){
    return this.http.delete(this.url + `api/dictionary/shipmenttype/${id}`)
  }
  getDictionaryShipmenttype(): Observable<IShipmentTypNci[]>{
    return this.http.get<ICargoGroupNci[]>(this.url + `api/dictionary/shipmenttype/all`)
  }
  postDictionaryShipmenttype(name: string){
    return this.http.post(this.url + `api/dictionary/shipmenttype/group/${name}`, {})
  }
}
