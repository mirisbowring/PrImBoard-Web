import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export function initializeKeycloak(keycloak: KeycloakService) {
    // return (): Promise<any> => {
    //     return new Promise(async (resolve, reject) => {
    //       try {
    //         await keycloak.init({
    //             config: {
    //                 url: environment.keycloak.issuer,
    //                 realm: environment.keycloak.realm,
    //                 clientId: environment.keycloak.clientId
    //             },
    //           loadUserProfileAtStartUp: false,
    //           initOptions: {
    //             onLoad: 'login-required',
    //             checkLoginIframe: true
    //           },
    //           bearerExcludedUrls: []
    //         });
    //         resolve();
    //       } catch (error) {
    //         reject(error);
    //       }
    //     });
    //   };
    return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.issuer,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin +  '/web/assets/silent-check-sso.html',
      },
      // bearerExcludedUrls: ['/assets', '/login'],
    });
}
