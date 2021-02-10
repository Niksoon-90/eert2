import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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
  getDownloadAbsentcargo(id: number){
    return this.http.get<Blob>(this.url + `api/file/download/absentcargo/${id}`, { observe: 'response', responseType: 'blob' as 'json' } )
  }
  putIasSaveId(sessionId: number, forecastCorrespondence: string, smallCorrespondence: string){
    return this.http.put(this.url + `api/file/routeId/${sessionId}?firstRouteId=${forecastCorrespondence}&secondRouteId=${smallCorrespondence}`, {})
  }

  postMacroUploadFile(fd, fileName: string, fio: string, login: string) {
    return this.http.post<any>(this.url + `api/file/uploadMacro?name=${fileName}&userFio=${fio}&userLogin=${login}`, fd, {
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

  postStationploadFile(fd) {
    return this.http.post<any>(this.url + `api/file/uploadStations`, fd, {
      reportProgress: true,
      observe: "events"
    });
  }

  getSummFooter(sessionId: number, filters: string) {
    return this.http.get(this.url + `api/file/pages/shipments/footer?search=sessionId:${sessionId}${filters}`)
  }



  getShipSession(): Observable<ISession[]> {
    return this.http.get<ISession[]>(this.url + `api/file/list?fileType=SHIPMENTS`);
  }

  deleteShipSession(id: number) {
    console.log(id)
    return this.http.delete(this.url + `api/session/${id}`)
  }

  getCopySissionShipments(fio: string, login: string, name: string ,sessionId: number) {
    return this.http.get(this.url + `api/session/copySession?fio=${fio}&login=${login}&name=${name}&sessionId=${sessionId}`)
  }

  getShipmetsPaginations(sessionId: number, page: number = 0, size: number = 50, sortColumn?: string, sortOrder?: string, filters?: string): Observable<IShipmentPagination> {
    let params = new HttpParams()
    if (sortColumn) {
      params = params.set('sort', sortColumn + ',' + sortOrder);
    }
    if (filters) {
      return this.http.get<IShipmentPagination>(this.url + `api/file/pages/shipments?search=sessionId:${sessionId}${filters}&page=${page}&size=${size}`, {params})
    }
    return this.http.get<IShipmentPagination>(this.url + `api/file/pages/shipments?search=sessionId:${sessionId}&page=${page}&size=${size}`, {params})
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
  putTransformFile(id: number, isReadyToTransfer: boolean) {
    return this.http.put(this.url + `api/file/${id}?isReadyToTransfer=${isReadyToTransfer}`, {})
  }

  //TODO cargo Type
  putDictionaryCargo(cargoGroupNci: ICargoGroupNci) {
    return this.http.put(this.url + `api/dictionary/cargo`, cargoGroupNci)
  }

  deleteDictionaryCargo(id: number) {
    return this.http.delete(this.url + `api/dictionary/cargo/${id}`)
  }

  getDictionaryCargo(): Observable<ICargoGroupNci[]> {
    return this.http.get<ICargoGroupNci[]>(this.url + `api/dictionary/cargo/all`)
  }

  postDictionaryCargo(name: string) {
    return this.http.post(this.url + `api/dictionary/cargo/name/${name}`, {})
  }

  //TODO Shipment type
  putDictionaryShipmenttype(dictionaryShipmenttype: IShipmentTypNci) {
    return this.http.put(this.url + `api/dictionary/shipmenttype`, dictionaryShipmenttype)
  }

  deleteDictionaryShipmenttype(id: number) {
    return this.http.delete(this.url + `api/dictionary/shipmenttype/${id}`)
  }

  getDictionaryShipmenttype(): Observable<IShipmentTypNci[]> {
    return this.http.get<IShipmentTypNci[]>(this.url + `api/dictionary/shipmenttype/all`)
  }

  postDictionaryShipmenttype(name: string) {
    return this.http.post(this.url + `api/dictionary/shipmenttype/group/${name}`, {})
  }

  //TODO station
  postDictionaryDictionaryStation(station: IStationNci) {
    return this.http.post(this.url + `api/dictionary/station`, station)
  }

  putDictionaryStation(stationNci: IStationNci) {
    return this.http.put(this.url + `api/dictionary/station`, stationNci)
  }

  deleteDictionaryStation(id: number) {
    return this.http.delete(this.url + `api/dictionary/station/${id}`)
  }

  getDictionaryDictionaryStation(): Observable<IStationNci[]> {
    return this.http.get<IStationNci[]>(this.url + `api/dictionary/station/all`)
  }

  //TODO dor
  postDictionaryRailway(item: IDorogyNci) {
    return this.http.post(this.url + `api/dictionary/railway`, item)
  }

  putDictionaryRailway(dorogyNci: IDorogyNci) {
    return this.http.put(this.url + `api/dictionary/railway`, dorogyNci)
  }

  deleteDictionaryRailway(id: number) {
    return this.http.delete(this.url + `api/dictionary/railway/${id}`)
  }

  getDictionaryDictionaryRailway(): Observable<IDorogyNci[]> {
    return this.http.get<IDorogyNci[]>(this.url + `api/dictionary/railway/all`)
  }

  //TODO createRowShip
  postCreateRowShip(id: number, shipment: IShipment) {
    return this.http.post(this.url + `api/file/shipments/${id}`, shipment)
  }

  getHistoricalSession(): Observable<ISession[]> {
    return this.http.get<ISession[]>(this.url + `api/file/list/historical`)
  }

  getHistorical(id: number): Observable<ISession[]> {
    return this.http.get<ISession[]>(this.url + `api/file/list/forecast/${id}`)
  }

  getHistoricalForcaste(): Observable<ISession[]> {
    return this.http.get<ISession[]>(this.url + `api/file/list/forecast`)
  }

  putConfirm(id: number) {
    return this.http.put(this.url + `api/file/forecast/confirm/${id}`, {})
  }

  //TODO subject
  postCreateSubject(subject: ISubjectNci) {
    return this.http.post(this.url + `api/dictionary/subject`, subject)
  }

  putSubject(subject: ISubjectNci) {
    return this.http.put(this.url + `api/dictionary/subject`, subject)
  }

  deleteSubject(id: number) {
    return this.http.delete(this.url + `api/dictionary/subject/${id}`)
  }

  getSubject(): Observable<ISubjectNci[]> {
    return this.http.get<ISubjectNci[]>(this.url + `api/dictionary/subject/all`)
  }

  //TODO 8
  postSynonym(cargoOwnerId: number, name: string) {
    return this.http.post(this.url + `api/catalog/cargo/owner/${cargoOwnerId}/synonym/${name}`, {})
  }

  getSynonym(cargoOwnerId: number): Observable<ISynonym[]> {
    return this.http.get<ISynonym[]>(this.url + `api/catalog/cargo/synonym/${cargoOwnerId}`)
  }

  deletetSynonym(cargoOwnerSynonymId: number) {
    return this.http.delete(this.url + `api/catalog/cargo/synonym/${cargoOwnerSynonymId}`)
  }
  postSearchSynonym(name: string){
    return this.http.get(this.url + `/api/catalog/cargo/synonyms/${name}`)
  }
}
