export interface IForecastIASModel {
  status?: string,
  descr?: string,
  var_num?: string,
  var_id?: number
}
export interface IForecastIASModelId {
  year?: number,
  st1_u?: string,
  st2_u_name?: string,
  st2_u?: string,
  len?: string,
  ntuda?: number,
  nobratno?: number,
  st1_u_name?: string,
  dor_name?: string
}

export interface IForecastIASModelIdResult {
  year?: number,
  st1_u?: string,
  st2_u_name?: string,
  st2_u?: string,
  len?: string,
  ntuda?: INtuda[],
  nobratno?: INobratno[],
  st1_u_name?: string,
  dor_name?: string

}export interface IForecastIASModelIdResults {
  year?: number,
  st1_u?: string,
  st2_u_name?: string,
  st2_u?: string,
  len?: string,
  ntuda?: number,
  nobratno?: number,
  st1_u_name?: string,
  dor_name?: string
}
interface INtuda {
  ntuda: number,
  year: number
}
interface INobratno {
  nobratno: number,
  year: number
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
  n11?:	string
  n12?:	string
  n13?:	string
  n14?:	string
  n15?:	string
  to_station?:	string
  to_station_code?: string
}

export interface IPathRequest {
  len?: string
  num?: string
  st?: string
  st_name?: string
}
