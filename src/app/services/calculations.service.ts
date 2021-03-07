import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {
  ICalculatingPredictiveRegression,
  ICargoNci,
  ICargoOwnerInfluenceFactor,
  IInfluenceNci
} from "../models/calculations.model";
import {IMongoObject, MonoCargoSystemsModel} from "../models/mono-cargo-systems.model";
import {FbCreateResponse, ISession, IShipment, IShipmentPagination} from "../models/shipmenst.model";
import {
  ICorrespondencesIiasForecast,
  IForecastIASModel,
  IForecastIASModelId,
  IPathRequest
} from "../models/forecastIAS.model";
import {IMacroIndexesIds, IMacroPokModel, IMultipleMakpok} from "../models/macroPok.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor(private http: HttpClient) {
  }

  private urlCalc = environment.hostCalc;


  putUpdateMacroForecast(id: number, value: number) {
    return this.http.put(this.urlCalc + `api/calc/forecast/value/${id}?newValue=${value}`, {})
  }
  postDownloadIASData(type: string, idTransferToIAS:number, sessionId: number){
    return this.http.post(this.urlCalc + `api/external/${type}/forecast/${idTransferToIAS}?sessionId=${sessionId}`, {})
  }

  postCorrespondenceOptimal(sessionId: number) {
    return this.http.post(this.urlCalc + `api/calc/correspondence/optimal/${sessionId}?calculatedYears=15&probeYears=2`, {})
  }

  getDivideSum(sessionId: number, filters: string, summ: number, year: string) {
    return this.http.get(this.urlCalc + `api/calc/correspondence/divideSum/filter?search=sessionId:${sessionId}${filters}&sum=${summ}&year=${year}`)
  }

  getOptimalMacro(sessionId: number, macroScenarioType: string): Observable<IMacroIndexesIds> {
    return this.http.get<IMacroIndexesIds>(this.urlCalc + `api/calc/regression/multiple/${sessionId}/optimal?macroScenarioType=${macroScenarioType}`)
  }

  getPartialListFilter(calcYearsNumber: number, forecastType: string, sessionId: number, forecastFiscalYear: string, page: number = 0, size: number = 50, sortColumn?: string, sortOrder?: string, filters?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    if (forecastFiscalYear !== null) {
      params = params.set('forecastFiscalYear', forecastFiscalYear)
    }
    if (sortColumn) {
      params = params.set('sort', sortColumn + ',' + sortOrder);
    }
    return this.http.get(this.urlCalc + `api/calc/correspondence/partial/filter?calcYearsNumber=${calcYearsNumber}&forecastType=${forecastType}&search=sessionId:${sessionId}${filters}`, {params})
  }

  getRegressionMetrics(sessionId: number): Observable<IMultipleMakpok[]> {
    return this.http.get<IMultipleMakpok[]>(this.urlCalc + `api/calc/regression/multiple/${sessionId}/metrics`)
  }

  getMacroPokList(sessionId: number, horizont: number): Observable<IMacroPokModel[]> {
    return this.http.get<IMacroPokModel[]>(this.urlCalc + `api/calc/allMacroForHistorical/${sessionId}?calcYearsNumber=${horizont}`)
  }

  getCalculationMultiple(id: number, idHorizonforecast: number, type: string, paramsMacroIndex: any): Observable<ICalculatingPredictiveRegression[]> {
    let Url = ''
    let params = new HttpParams()
    for (const actor of paramsMacroIndex) {
      params = params.append('macroIndexesIds', actor);
    }
    paramsMacroIndex.length === 0 ? Url = this.urlCalc + `api/calc/regression/multiple/${id}?calcYearsNumber=${idHorizonforecast}&macroScenarioType=${type}` : Url = this.urlCalc + `api/calc/regression/multiple/${id}?calcYearsNumber=${idHorizonforecast}&${params}&macroScenarioType=${type}`
    return this.http.get<ICalculatingPredictiveRegression[]>(Url)
  }

  getCorrelation(sessionId: number): Observable<IShipmentPagination> {
    return this.http.get<IShipmentPagination>(this.urlCalc + `api/calc/correlation/${sessionId}`)
  }

  postHierarchicalShipment(sessionId: number){
    return this.http.post(this.urlCalc + `api/calc/correspondence/hierarchical/${sessionId}`, {})
  }

  getPerspective(sessionId: number, iasMetalForecastId?: number, iasOilForecastId?: number, iasRudaForecastId?: number, perspectiveSessionId?: number): Observable<IShipment[]> {
    let params = new HttpParams()
    if (iasMetalForecastId !== null) params = params.set('iasMetalForecastId', iasMetalForecastId.toString())
    if (iasOilForecastId !== null) params = params.set('iasOilForecastId', iasOilForecastId.toString())
    if (iasRudaForecastId !== null) params = params.set('iasRudaForecastId', iasRudaForecastId.toString())
    if (perspectiveSessionId !== null) params = params.set('perspectiveSessionId', perspectiveSessionId.toString())
    params = params.set('sessionId', sessionId.toString())
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/correspondence/perspective?`, {params})
  }


  getGeneralmethod2(sessionId: number, idHorizonforecast: number, forecastName: string, sustainable: string, small: string, userFio: string, userLogin: string, primaryForecastFiscalYear: string, secondaryForecastFiscalYear: string, page: number = 0, size: number = 50, sortColumn?: string, sortOrder?: string): Observable<ISession> {
    let sustainableType = new HttpParams()
    let smallType = new HttpParams()
    sustainableType = sustainableType.append('primaryForecastType', sustainable)
    smallType = smallType.append('secondaryForecastType', small)
    let params = new HttpParams()
    if (primaryForecastFiscalYear !== null) {
      params = params.set('primaryForecastFiscalYear', primaryForecastFiscalYear);
    }
    if (secondaryForecastFiscalYear !== null) {
      params = params.set('secondaryForecastFiscalYear', secondaryForecastFiscalYear);
    }
    if (sortColumn) {
      params = params.set('sort', sortColumn + ',' + sortOrder);
    }
    return this.http.get<ISession>(this.urlCalc + `api/calc/correspondence/general/${sessionId}?calcYearsNumber=${idHorizonforecast}&forecastName=${forecastName}&${sustainableType}&${smallType}&userFio=${userFio}&userLogin=${userLogin}&page=${page}&size=${size}`, {params})
  }


  //TODO 4
  getOil(): Observable<MonoCargoSystemsModel[]> {
    return this.http.get<MonoCargoSystemsModel[]>(this.urlCalc + `api/external/oil`)
  }

  getMetallurgy(): Observable<MonoCargoSystemsModel[]> {
    return this.http.get<MonoCargoSystemsModel[]>(this.urlCalc + `api/external/metal`)
  }

  getOre(): Observable<MonoCargoSystemsModel[]> {
    return this.http.get<MonoCargoSystemsModel[]>(this.urlCalc + `api/external/ruda`)
  }

  getIasForecastId(id: number): Observable<ICorrespondencesIiasForecast[]> {
    return this.http.get<ICorrespondencesIiasForecast[]>(this.urlCalc + `api/external/routes/correspondences/${id}`)
  }

  getPathRequest(iasForecastId: number, iasCorrespondenceId: number): Observable<IPathRequest[]> {
    return this.http.get<IPathRequest[]>(this.urlCalc + `api/external/routes/correspondences/${iasForecastId}/${iasCorrespondenceId}`)
  }

  getForcastIasId(id: number): Observable<IForecastIASModelId[]> {
    return this.http.get<IForecastIASModelId[]>(this.urlCalc + `api/external/routes/forecast/${id}`)
  }

  getForcastIas(): Observable<IForecastIASModel[]> {
    return this.http.get<IForecastIASModel[]>(this.urlCalc + `api/external/routes/forecast`)
  }

  postExternalForecast(mongo: IMongoObject, type: string) {
    return this.http.post(this.urlCalc + `api/external/${type}/forecast`, mongo)
  }

  //TODO 5

  putCargoNci(cargoNci: ICargoNci) {
    return this.http.put(this.urlCalc + `api/catalog/cargo`, cargoNci)
  }

  getSearchCargoNci(id: number) {
    return this.http.get(this.urlCalc + `api/catalog/cargo/${id}`)
  }

  deleteCargoNci(id: number) {
    return this.http.delete(this.urlCalc + `api/catalog/cargo/${id}`)
  }

  getAllCargoNci(): Observable<ICargoNci[]> {
    return this.http.get<ICargoNci[]>(this.urlCalc + `api/catalog/cargo/all`)
  }

  getItemCargoNci(name: string): Observable<ICargoNci> {
    return this.http.get<ICargoNci>(this.urlCalc + `api/catalog/cargo/owner/${name}`)
  }

  getCreateCargoNci(name: string) {
    return this.http.post(this.urlCalc + `api/catalog/cargo/owner/${name}`, {})
  }

  //TODO 6
  postInfluenceNci(influenceNci: IInfluenceNci) {
    return this.http.post(this.urlCalc + `api/catalog/influence`, influenceNci)
  }

  putInfluenceNci(influenceNci: IInfluenceNci) {
    return this.http.put(this.urlCalc + `api/catalog/influence`, influenceNci)
  }

  getSearchInfluenceNci(id: number) {
    return this.http.get(this.urlCalc + `api/catalog/influence/${id}`)
  }

  deleteInfluenceNci(id: number) {
    return this.http.delete(this.urlCalc + `api/catalog/influence/${id}`)
  }

  getInfluenceNci(): Observable<IInfluenceNci[]> {
    return this.http.get<IInfluenceNci[]>(this.urlCalc + `api/catalog/influence/all`)
  }

  //TODO 7
  postCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor) {
    return this.http.post(this.urlCalc + `api/cargo/factor`, cargoOwnerInfluenceFactor)
  }

  putCargoOwnerInfluenceFactor(cargoOwnerInfluenceFactor: ICargoOwnerInfluenceFactor) {
    return this.http.put(this.urlCalc + `api/cargo/factor`, cargoOwnerInfluenceFactor)
  }

  getCargoOwnerInfluenceFactor(cargoOwnerId: number, influenceFactorId: number) {
    return this.http.get(this.urlCalc + `api/cargo/factor/?cargoOwnerId=${cargoOwnerId}&influenceFactorId=${influenceFactorId}`)
  }

  getCargoOwnerInfluenceFactorId(cargoOwnerInfluenceFactorId: number) {
    return this.http.get(this.urlCalc + `api/cargo/factor/${cargoOwnerInfluenceFactorId}`)
  }

  deleteCargoOwnerInfluenceFactorId(cargoOwnerInfluenceFactorId: number) {
    return this.http.delete(this.urlCalc + `api/cargo/factor/${cargoOwnerInfluenceFactorId}`)
  }

  getAllCargoOwnerInfluenceFactor(): Observable<ICargoOwnerInfluenceFactor[]> {
    return this.http.get<ICargoOwnerInfluenceFactor[]>(this.urlCalc + `api/cargo/factor/all`)
  }

  getAllFactorCargoId(cargoOwnerId: number): Observable<ICargoOwnerInfluenceFactor[]> {
    return this.http.get<ICargoOwnerInfluenceFactor[]>(this.urlCalc + `api/cargo/factor/all/${cargoOwnerId}`)
  }

  //TODO 8
  getCargoOwnerSessionId(cargoOwnerSessionId: number, historicalDataSessionId: number): Observable<IShipment[]> {
    return this.http.get<IShipment[]>(this.urlCalc + `api/calc/claims/?cargoOwnerSessionId=${cargoOwnerSessionId}&historicalDataSessionId=${historicalDataSessionId}`)
  }

  //TODO ИАС
  postCreateEmptySession(name: string, userFio: string, userLogin: string) {
    return this.http.post(this.urlCalc + `api/calc/correspondence/createEmptySession?dimension=MILLION_TONS&name=${name}&userFio=${userFio}&userLogin=${userLogin}`, {})
  }

  //TODO 9
  getDownloadMultiple(sessionId: number) {
    return this.http.get<Blob>(this.urlCalc + `api/reports/download/regression/multiple/{sessionId}?sessionId=${sessionId}`, {
      observe: 'response',
      responseType: 'blob' as 'json'
    })
  }

  getLandBorder(sessionId: number) {
    return this.http.get(this.urlCalc + `api/reports/download/land_border/{sessionId}?sessionId=${sessionId}`, {
      observe: 'response',
      responseType: 'blob' as 'json'
    })
  }

  getSeaPort(sessionId: number) {
    return this.http.get(this.urlCalc + `api/reports/download/sea_ports/{sessionId}?sessionId=${sessionId}`, {
      observe: 'response',
      responseType: 'blob' as 'json'
    })
  }

}
