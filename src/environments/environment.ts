// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: window["env"]["gatewayURL"] || true,
  gateway: window["env"]["gatewayURL"] || "",
  defaultPageSize: window["env"]["defaultPageSize"] || 30,
  keycloak: {
    // Url of the Identity Provider
    issuer: window["env"]["keycloak_issuer"] || "https://keycloak.com/auth",

    // Realm
    realm: window["env"]["keycloak_realm"] || "master",

    // The SPA's id.
    // The SPA is registerd with this id at the auth-serverß
    clientId: window["env"]["keycloak_clientID"] || "clientID",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
