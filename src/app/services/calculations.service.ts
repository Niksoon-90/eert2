import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {
  ICalculatingPredictiveRegression,
  ICargoNci,
  ICargoOwnerInfluenceFactor,
  IInfluenceNci
} from "../models/calculations.model";
import {MonoCargoSystemsModel} from "../models/mono-cargo-systems.model";
import {IShipment} from "../models/shipmenst.model";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId,
  IPathRequest
} from "../models/forecastIAS.model";
import {IMacroPokModel} from "../models/macroPok.model";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor(private http: HttpClient) { }

  private url = environment.hostURL;
  private urlCalc = environment.hostCalc;


  putUpdateMacroForecast(id: number, value: number){
    return this.http.put(this.urlCalc + `api/calc/forecast/value/${id}?newValue=${value}`, {})
  }
  getMacroPokList(sessionId: number, horizont: number): Observable<IMacroPokModel[]>{
    return this.http.get<IMacroPokModel[]>(this.urlCalc + `api/calc/allMacroForHistorical/${sessionId}?calcYearsNumber=${horizont}`)
  }
  getCalculationMultiple(id: number, idHorizonforecast: number, type: string, paramsMacroIndex: any): Observable<ICalculatingPredictiveRegression[]>{
    let Url = ''
    let params = new HttpParams()
    for (const actor of paramsMacroIndex) {
      params = params.append('macroIndexesIds', actor);
    }
    console.log(params.toString());
    paramsMacroIndex.length === 0 ? Url = this.urlCalc + `api/calc/regression/multiple/${id}?calcYearsNumber=${idHorizonforecast}&macroScenarioType=${type}` : Url = this.urlCalc + `api/calc/regression/multiple/${id}?calcYearsNumber=${idHorizonforecast}&${params}&macroScenarioType=${type}`
    console.log(Url)
    return this.http.get<ICalculatingPredictiveRegression[]>(Url)
  }
  getCalculationSimple(id: number, idHorizonforecast: number, forecastName: string): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/simple/${id}?calcYearsNumber=${idHorizonforecast}&forecastName=${forecastName}`)
  }
  getCalculationFiscal(id: number, idHorizonforecast: number, year: string, forecastName: string): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/fiscal/${id}?calcYearsNumber=${idHorizonforecast}&fiscalYear=${year}&forecastName=${forecastName}`)
  }
  getCalculationFixed(id: number, idHorizonforecast: number, forecastName: string): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/tendency/fixed/${id}?calcYearsNumber=${idHorizonforecast}&forecastName=${forecastName}`)
  }

  getCalculationIncreasing(id: number, idHorizonforecast: number, forecastName: string): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/tendency/increasing/${id}?calcYearsNumber=${idHorizonforecast}&forecastName=${forecastName}`)
  }
  getCalculationAverage(id: number, idHorizonforecast: number, forecastName: string): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/average/fixed/${id}?calcYearsNumber=${idHorizonforecast}&forecastName=${forecastName}`)
  }
  getCalculationAverageIncreasing(id: number, idHorizonforecast: number, forecastName: string): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/average/increasing/${id}?calcYearsNumber=${idHorizonforecast}&forecastName=${forecastName}`)
  }
  getCorrelation(idHorizonforecast: number, forecastType: string): Observable<IShipment[]>{
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correlation/${idHorizonforecast}?forecastType=${forecastType}`)
  }
  getPerspective(urlPerspective: string): Observable<IShipment[]>{
    return this.http.get<IShipment[]>(this.urlCalc + urlPerspective)

  }
  //TODO 4
  getOil(): Observable<MonoCargoSystemsModel[]>{
    return this.http.get<MonoCargoSystemsModel[]>(this.urlCalc + `api/external/oil`)
  }
  getMetallurgy(): Observable<MonoCargoSystemsModel[]>{
    return this.http.get<MonoCargoSystemsModel[]>(this.urlCalc + `api/external/metal`)
  }
  getOre(): Observable<MonoCargoSystemsModel[]>{
    return this.http.get<MonoCargoSystemsModel[]>(this.urlCalc + `api/external/ruda`)
  }
  getIasForecastId(id: number): Observable<ICorrespondencesIiasForecast[]>{
    return this.http.get<ICorrespondencesIiasForecast[]>(this.urlCalc + `api/external/routes/correspondences/${id}`)
  }
  getPathRequest(iasForecastId: number, iasCorrespondenceId: number): Observable<IPathRequest[]>{
    return this.http.get<IPathRequest[]>(this.urlCalc + `api/external/routes/correspondences/${iasForecastId}/${iasCorrespondenceId}`)
  }
  getForcastIasId(id: number): Observable<IForecastIASModelId[]>{
    return this.http.get<IForecastIASModelId[]>(this.urlCalc + `api/external/routes/forecast/${id}`)
  }
  getForcastIas(): Observable<IForecastIASModel[]>{
    return this.http.get<IForecastIASModel[]>(this.urlCalc + `api/external/routes/forecast`)
  }
  //TODO 5

  putCargoNci(cargoNci:ICargoNci){
    return this.http.put(this.urlCalc + `api/catalog/cargo`, cargoNci)
  }
  getSearchCargoNci(id: number){
    return this.http.get(this.urlCalc + `api/catalog/cargo/${id}`)
  }
  deleteCargoNci(id: number){
    return this.http.delete(this.urlCalc + `api/catalog/cargo/${id}`)
  }
  getAllCargoNci(): Observable<ICargoNci[]>{
    return this.http.get<ICargoNci[]>(this.urlCalc + `api/catalog/cargo/all`)
  }
  getItemCargoNci(name: string): Observable<ICargoNci>{
    return this.http.get<ICargoNci>(this.urlCalc + `api/catalog/cargo/owner/${name}`)
  }
  getCreateCargoNci(name: string){
    return this.http.post(this.urlCalc + `api/catalog/cargo/owner/${name}`, {})
  }

  //TODO 6
  postInfluenceNci(influenceNci: IInfluenceNci){
    return this.http.post(this.urlCalc + `api/catalog/influence`, influenceNci)
  }
  putInfluenceNci(influenceNci: IInfluenceNci){
    return this.http.put(this.urlCalc + `api/catalog/influence`, influenceNci)
  }
  getSearchInfluenceNci(id: number){
    return this.http.get(this.urlCalc + `api/catalog/influence/${id}`)
  }
  deleteInfluenceNci(id:number){
    return this.http.delete(this.urlCalc + `api/catalog/influence/${id}`)
  }
  getInfluenceNci(): Observable<IInfluenceNci[]>{
    return this.http.get<IInfluenceNci[]>(this.urlCalc + `api/catalog/influence/all`)
  }
  //TODO 7
  postCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor){
    return this.http.post(this.urlCalc + `api/cargo/factor`, cargoOwnerInfluenceFactor)
  }
  putCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor){
    return this.http.put(this.urlCalc + `api/cargo/factor`, cargoOwnerInfluenceFactor)
  }
  getCargoOwnerInfluenceFactor(cargoOwnerId:number, influenceFactorId: number){
    return this.http.get(this.urlCalc + `api/cargo/factor/?cargoOwnerId=${cargoOwnerId}&influenceFactorId=${influenceFactorId}`)
  }
  getCargoOwnerInfluenceFactorId(cargoOwnerInfluenceFactorId: number){
    return this.http.get(this.urlCalc + `api/cargo/factor/${cargoOwnerInfluenceFactorId}`)
  }
  deleteCargoOwnerInfluenceFactorId(cargoOwnerInfluenceFactorId: number) {
    return this.http.delete(this.urlCalc + `api/cargo/factor/${cargoOwnerInfluenceFactorId}`)
  }
  getAllCargoOwnerInfluenceFactor(): Observable<ICargoOwnerInfluenceFactor[]>{
    return this.http.get<ICargoOwnerInfluenceFactor[]>(this.urlCalc + `api/cargo/factor/all`)
  }
  getAllFactorCargoId(cargoOwnerId: number): Observable<ICargoOwnerInfluenceFactor[]>{
    return this.http.get<ICargoOwnerInfluenceFactor[]>(this.urlCalc + `api/cargo/factor/all`)
  }
  //TODO 8
  getCargoOwnerSessionId(cargoOwnerSessionId: number, historicalDataSessionId: number): Observable<IShipment[]>{
    return  this.http.get<IShipment[]>(this.urlCalc + `api/calc/claims/?cargoOwnerSessionId=${cargoOwnerSessionId}&historicalDataSessionId=${historicalDataSessionId}`)
  }
  //TODO ИАС
  postCreateEmptySession(name: string, userFio: string, userLogin: string){
    return this.http.post(this.urlCalc + `api/calc/correspondence/createEmptySession?dimension=MILLION_TONS&name=${name}&userFio=${userFio}&userLogin=${userLogin}`, {})
  }


}
