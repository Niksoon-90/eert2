export interface IMacroPokModel {
  cargoGroup?:	string
  id?: number
  macroIndex?:	string
  shipmentType?:	string
  valueHigh?: number
  valueMedium?: number
  valueLow?: number
  year?: number
}

export interface IMultipleMakpok{
  cargoGroup?:	string
  id?: number
  meanAbsoluteError?: number
  meanAbsolutePercentageError?:	number
  meanSquaredError?:	number
  r2Score?:	number
  sessionId?: number
  shipmentType?:	string
}

export interface IMacroIndexesIds {
  macroIndexesIds?: number[],
  macroIndexesData?: IMacroIndexesData[]
}

export interface IMacroIndexesData {
  macroIndexesIds?: number[],
  macroIndexesNames?: any[],
  cargoGroup?: string,
  shipmentType?: string,
  r2?: number,
  mape?: number,
  mse?: number,
  f?: number,
  mae?: number
}
