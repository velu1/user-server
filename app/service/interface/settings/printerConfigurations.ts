export interface PrinterConfigurationsInterface {
  type: string;
  namingSeries: string;
  partsInNamingSeries: string;
  delimiter: string;
  printType: string;
  priority: { priority: string; value: string }[];
  audit: boolean;
  auditType: string;
  imageStore?: boolean;
  entityTableRows: any;
  labelData: any;
}
