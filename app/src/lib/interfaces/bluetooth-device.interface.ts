
export interface Device {
  serviceClasses: any[];
  trusted: boolean;
  connectedProfiles: string[];
  pairing: boolean;
  rssi: number;
  scanRecord: any[];
  name: string;
  address: string;
  paired: boolean;
  typeOfDevice: TypeOfDevice;
  manufacturerData: ManufacturerData;
  adapterAddress: string;
  classOfDevice: number;
  blocked: boolean;
}


export interface ManufacturerData {
  scanRecord?: number[];
  companyId?: number[];
  data?: number[];
}

export enum TypeOfDevice {
  Ble = "ble",
  Bredr = "bredr",
  Dual = "dual",
}
