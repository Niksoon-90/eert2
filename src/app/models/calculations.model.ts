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

export interface ICargoNci {
  "id"?: number,
  "name"?: string

}export interface IInfluenceNci {
  "id"?: number,
  "name"?: string,
  "weight"?: number
}

export interface ICargoOwnerInfluenceFactor {
  "cargoOwnerId"?: number,
  "id"?: number,
  "influenceFactorId"?: number
}

