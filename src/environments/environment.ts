// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hostURL: 'http://vpn-djserv.dgs:38088/app/main/',
  hostCalc: 'http://vpn-djserv.dgs:38089/app/calculation/',
//  hostAuth: 'http://192.168.11.191:8080/'

  // hostURL: 'http://vpn-djserv.dgs:48080/app/main/',
  // hostCalc: 'http://vpn-djserv.dgs:48080/app/calculation/',
  hostAuth: 'http://192.168.11.180:8080/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
