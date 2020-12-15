export interface ISession {
  id?: number;
  name?: string;
  year?: string[];
  userLogin?: string;
  userFio?: string;
  dateWrite?: string
  fileType?: string
  historicalYears?: string[]
  parentHistoricalSessionId?: number
  forecastCreated?: boolean
};
export interface IShipment {
  cargoGroup?:	string
  fromRoad?:	string
  fromStation?:	string
  fromStationCode?:	number
  fromSubject?:	string
  id?:	number
  receiverName?:	string
  senderName?:	string
  shipmentType?:	string
  shipmentYearValuePairs?:	IShipmentYearValuePairs[]
  toRoad?:	string
  toStation?:	string
  toStationCode?:	number
  toSubject?:	string
  primary?: boolean
  session?: number

}

interface IShipmentYearValuePairs {
  id?:	number
  value?:	number
  year?:	number
  shipment?: number,
  calculated?: boolean
}

export interface IResult {
  value: number
  id: number
}
