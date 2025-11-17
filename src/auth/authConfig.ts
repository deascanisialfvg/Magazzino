import { Configuration } from '@azure/msal-browser'

export const msalConfig: Configuration = {
  auth: {
    clientId: 'd7e33855-515b-4a9d-9574-40f76b6d3230', // Client ID MagazzinoAI
    authority: 'https://login.microsoftonline.com/4edd0fb5-fd85-4f67-83b4-9803668de19d', // Tenant ID IAL
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'profile', 'openid'],
}

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
}