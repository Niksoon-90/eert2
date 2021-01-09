import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs';
import {ISession, IShipment, IShipmentPagination, ISynonym} from '../models/shipmenst.model';
import {IMacroPokModel} from "../models/macroPok.model";
import {
  ICalculatingPredictiveRegression,
  ICargoGroupNci, IDorogyNci,
  IShipmentTypNci,
  IStationNci, ISubjectNci
} from "../models/calculations.model";

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
  postMacroUploadFile(fd, fileName: string, macroScenarioType: string, fio: string, login: string) {
    return this.http.post<any>(this.url + `api/file/uploadMacro?macroScenarioType=${macroScenarioType}&name=${fileName}&userFio=${fio}&userLogin=${login}`, fd, {
      reportProgress: true,
      observe: "events"
    });
  }
  postSynonymUploadFile(fd, fileName: string, fio: string, login: string) {
    return this.http.post<any>(this.url + `api/file/uploadCargoOwnerSynonyms?name=${fileName}&userFio=${fio}&userLogin=${login}`, fd, {
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
  getShipmetsPaginations(sessionId: number, page: number, size: number = 50): Observable<IShipmentPagination>{
    return this.http.get<IShipmentPagination>(this.url + `api/file/pages/shipments?page=${page}&sessionId=${sessionId}&size=${size}`)
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

  getShipmentsYearsItems(id: number, calculated: any[]): Observable<IShipment> {
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
    return this.http.post(this.url + `api/dictionary/cargo/name/${name}`, {})
  }
  //TODO Shipment type
  putDictionaryShipmenttype(dictionaryShipmenttype: IShipmentTypNci){
    return this.http.put(this.url + `api/dictionary/shipmenttype`, dictionaryShipmenttype)
  }
  deleteDictionaryShipmenttype(id: number){
    return this.http.delete(this.url + `api/dictionary/shipmenttype/${id}`)
  }
  getDictionaryShipmenttype(): Observable<IShipmentTypNci[]>{
    return this.http.get<IShipmentTypNci[]>(this.url + `api/dictionary/shipmenttype/all`)
  }
  postDictionaryShipmenttype(name: string){
    return this.http.post(this.url + `api/dictionary/shipmenttype/group/${name}`, {})
  }
  //TODO station
  postDictionaryDictionaryStation(station: IStationNci){
    return this.http.post(this.url + `api/dictionary/station`, station)
  }
  putDictionaryStation(stationNci: IStationNci){
    return this.http.put(this.url + `api/dictionary/station`, stationNci)
  }
  deleteDictionaryStation(id: number){
    return this.http.delete(this.url + `api/dictionary/station/${id}`)
  }
  getDictionaryDictionaryStation(): Observable<IStationNci[]>{
    return this.http.get<IStationNci[]>(this.url + `api/dictionary/station/all`)
  }
  //TODO dor
  postDictionaryRailway(item: IDorogyNci){
    return this.http.post(this.url + `api/dictionary/railway`, item)
  }
  putDictionaryRailway(dorogyNci: IDorogyNci){
    return this.http.put(this.url + `api/dictionary/railway`, dorogyNci)
  }
  deleteDictionaryRailway(id: number){
    return this.http.delete(this.url + `api/dictionary/railway/${id}`)
  }
  getDictionaryDictionaryRailway(): Observable<IDorogyNci[]>{
    return this.http.get<IDorogyNci[]>(this.url + `api/dictionary/railway/all`)
  }
  //TODO createRowShip
  postCreateRowShip(id: number, shipment: IShipment){
    return this.http.post(this.url + `api/file/shipments/${id}`, shipment)
  }
  getHistoricalSession(): Observable<ISession[]>{
    return this.http.get<ISession[]>(this.url + `api/file/list/historical`)
  }
  getHistorical(id: number): Observable<ISession[]>{
    return this.http.get<ISession[]>(this.url + `api/file/list/forecast/${id}`)
  }
  getHistoricalForcaste(): Observable<ISession[]>{
    return this.http.get<ISession[]>(this.url + `api/file/list/forecast`)
  }
  putConfirm(id: number){
    return this.http.put(this.url + `api/file/forecast/confirm/${id}`, {})
  }
  //TODO subject
  postCreateSubject(subject: ISubjectNci){
    return this.http.post(this.url + `api/dictionary/subject`, subject)
  }
  putSubject(subject: ISubjectNci){
    return this.http.put(this.url + `api/dictionary/subject`, subject)
  }
  deleteSubject(id: number){
    return this.http.delete(this.url + `api/dictionary/subject/${id}`)
  }
  getSubject(): Observable<ISubjectNci[]>{
    return this.http.get<ISubjectNci[]>(this.url + `api/dictionary/subject/all`)
  }
  //TODO 8
  postSynonym(cargoOwnerId: number, name: string){
    return this.http.post(this.url + `api/catalog/cargo/owner/${cargoOwnerId}/synonym/${name}`, {})
  }
  getSynonym(cargoOwnerId: number): Observable<ISynonym[]>{
    return this.http.get<ISynonym[]>(this.url + `api/catalog/cargo/synonym/${cargoOwnerId}`)
  }
  deletetSynonym(cargoOwnerSynonymId: number){
    return this.http.delete(this.url + `api/catalog/cargo/synonym/${cargoOwnerSynonymId}`)
  }
}
