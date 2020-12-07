export interface IForecastIASModel {
  status?: string,
  descr?: string,
  var_num?: string,
  var_id?: number
}
export interface IForecastIASModelId {
  year?: number,
  st1_p?: string,
  st2_name?: string,
  st2_p?: string,
  len?: string,
  ntuda?: number,
  nobratno?: number,
  p_name?: string,
  st1_name?: string,
  dor_name?: string
}

export interface ICorrespondencesIiasForecast {
  cargo_group?: string
  corr_id?:	string
  from_station?:	string
  from_station_code?:	string
  n1?:	string
  n10?:	string
  n2?:	string
  n3?:	string
  n4?:	string
  n5?:	string
  n6?:	string
  n7?:	string
  n8?:	string
  n9?:	string
  to_station?:	string
  to_station_code?: string
}

export interface IPathRequest {
  len?: string
  num?: string
  st?: string
  st_name?: string
}
