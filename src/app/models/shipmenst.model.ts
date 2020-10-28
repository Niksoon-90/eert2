export interface ISession {
  id?: number;
  name?: string;
  year?: string[];
  userLoginAdd?: string;
  userFioAdd?: string;
  dateWrite?: string
};
export interface IShipment {
  cargoGroup:	string
  fromRoad:	string
  fromStation:	string
  fromStationCode:	number
  fromSubject:	string
  id:	number
  receiverName:	string
  senderName:	string
  shipmentType:	string
  shipmentYearValuePairs:	IShipmentYearValuePairs[]
  toRoad:	string
  toStation:	string
  toStationCode:	number
  toSubject:	string
}

interface IShipmentYearValuePairs {
  id:	number
  value:	number
  year:	number
}
