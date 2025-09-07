/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/**
 * @undocumented
 */
export enum DownloadOption {
  CSV = 0,
  JSON,
  PDF,
}

/**
 * @undocumented
 */
export interface Criteria {
  index: string;
  title: string;
}


export interface NavigationMapping {
  absolutely: Function;
  relatively: Function;
}
