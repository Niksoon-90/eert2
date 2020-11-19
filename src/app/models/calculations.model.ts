
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
  regressionParameters: number[],
  primary?: boolean
}
