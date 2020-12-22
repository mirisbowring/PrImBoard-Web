(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["production"] = "${PRODUCTION}";
  window["env"]["gatewayURL"] = "${GATEWAY_URL}";
  window["env"]["defaultPageSize"] = "${DEFAULT_PAGE_SIZE}";
  window["env"]["keycloak_issuer"] = "${KEYCLOAK_ISSUER}";
  window["env"]["keycloak_realm"] = "${KEYCLOAK_REALM}";
  window["env"]["keycloak_clientID"] = "${KEYCLOAK_CLIENT_ID}";

})(this);
