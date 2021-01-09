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
  forecastConfirmed?: boolean
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
  cargoSubGroup?: string
}

interface IShipmentYearValuePairs {
  id?:	number
  value?:	number
  year?:	number
  shipment?: number,
  calculated?: boolean
}
export interface IShipmentPagination {
  content: IShipment[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: IPageable
  size: number
  sort: ISort
  totalElements: number
  totalPages: number
}
interface IPageable {
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  sort: ISort
  unpaged: boolean
}
interface ISort {
  sorted: boolean,
  unsorted: boolean,
  empty: boolean
}

export interface ISynonym{
  cargoOwnerId?: number,
  id?: number,
  name?: string
}
