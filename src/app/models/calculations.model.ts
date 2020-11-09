export interface ICalculationsModel {
  id: number;
  name: string;
  startDate: string;
  state: string;
}
export interface ISelectMethodUsers {
  id: number;
  type: string;
  name: string;
}
export interface IHorizonforecast {
  name: number;
}
export interface ICalculatingPredictiveRegression{
  sessionId: number,
  cargoGroup: string,
  shipmentType: string,
  groupVolumesByYears: {},
  macroIndexesByYears: {},
  calculatedVolumes: {},
  regressionParameters: number[]
}
