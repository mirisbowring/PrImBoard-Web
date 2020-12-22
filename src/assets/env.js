(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["production"] = false;
  window["env"]["gatewayURL"] = "https://10.101.1.8/gateway/";
  window["env"]["defaultPageSize"] = 30;
  window["env"]["keycloak_issuer"] = "https://10.101.1.8/keycloak/auth";
  window["env"]["keycloak_realm"] = "primboard";
  window["env"]["keycloak_clientID"] = "web-client";

})(this);
