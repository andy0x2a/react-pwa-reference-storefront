/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import { cortexFetch, adminFetch } from './Cortex';

import * as Config from '../ep.config.json';

let userFormBody = [];
let userFormBodyString = '';
let newaccountform = '';

interface PublicUserDetailsInterface {
  username?: string,
  password?: string,
  'grant_type'?: string,
  role?: string,
  scope?: string,
  code?: string,
  'redirect_uri'?: string,
  'client_id'?: string,
}

function generateFormBody(userDetails) {
  Object.keys(userDetails).forEach((encodedKey) => {
    const encodedValue = userDetails[encodedKey];
    userFormBody.push(`${encodedKey}=${encodedValue}`);
  });
  userFormBodyString = userFormBody.join('&');
}

export function login() {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) === null) {
      userFormBodyString = '';
      userFormBody = [];
      const publicUserDetails: PublicUserDetailsInterface = {
        username: '',
        password: '',
        grant_type: 'password',
        role: 'PUBLIC',
        scope: Config.cortexApi.scope,
      };

      generateFormBody(publicUserDetails);
      cortexFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: userFormBodyString,
      }).then(res => res.json())
        .then((res) => {
          if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) === null) {
            localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
          }
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, publicUserDetails.username);
          resolve(res);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error.message);
          reject(error);
        });
    } else {
      resolve(userFormBodyString);
    }
  }));
}

export function loginRegistered(username, password) {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`) != null) {
      userFormBodyString = '';
      userFormBody = [];
      const registeredUserDetails = {
        username,
        password,
        grant_type: 'password',
        role: 'REGISTERED',
        scope: Config.cortexApi.scope,
      };

      generateFormBody(registeredUserDetails);

      cortexFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
        body: userFormBodyString,
      }).then((res) => {
        if (res.status === 401) {
          resolve(401);
        }
        if (res.status === 400) {
          resolve(400);
        } else if (res.status === 200) {
          return res.json();
        }
        return null;
      }).then((res) => {
        if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) === null) {
          localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, res.role);
        }
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, res.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthToken`, `Bearer ${res.access_token}`);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, registeredUserDetails.username);
        resolve(200);
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
    } else {
      resolve(userFormBodyString);
    }
  }));
}

export function loginRegisteredAuthService(code, redirectUri, clientId) {
  return new Promise(((resolve, reject) => {
    if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`) === null) {
      userFormBodyString = '';
      userFormBody = [];
      const registeredUserDetails: PublicUserDetailsInterface = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
      };
      generateFormBody(registeredUserDetails);
      adminFetch('/oauth2/tokens', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: userFormBodyString,
      }).then((res) => {
        if (res.status === 401) {
          resolve(401);
        }
        if (res.status === 400) {
          resolve(400);
        } else if (res.status === 200) {
          return res.json();
        }
        return null;
      }).then((res) => {
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthRole`, 'REGISTERED');
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthScope`, Config.cortexApi.scope);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`, `Bearer ${res.access_token}`);
        localStorage.setItem(`${Config.cortexApi.scope}_oAuthUserName`, registeredUserDetails.username);
        resolve(200);
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
    } else {
      resolve(userFormBodyString);
    }
  }));
}

export function logout() {
  return new Promise(((resolve, reject) => {
    cortexFetch('/oauth2/tokens', {
      method: 'delete',
    }).then((res) => {
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthRole`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthScope`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthToken`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthUserName`);
      localStorage.removeItem(`${Config.cortexApi.scope}_b2bCart`);
      localStorage.removeItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`);
      localStorage.removeItem(`${Config.cortexApi.scope}_keycloakSessionState`);
      localStorage.removeItem(`${Config.cortexApi.scope}_keycloakCode`);
      resolve(res);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      reject(error);
    });
  }));
}

export function logoutAccountManagementUser() {
  logout().then(() => {
    const keycloakLogoutRedirectUrl = `${Config.b2b.keycloak.logoutRedirectUrl}?redirect_uri=${encodeURIComponent(Config.b2b.keycloak.callbackUrl)}`;
    window.location.href = keycloakLogoutRedirectUrl;
  });
}

export function getRegistrationForm() {
  return new Promise(((resolve, reject) => {
    cortexFetch('/?zoom=newaccountform',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
      .then(res => res.json())
      .then((res) => {
        const registrationLink = res.links.find(link => link.rel === 'newaccountform');
        newaccountform = registrationLink.uri;
        resolve(registrationLink.uri);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
  }));
}

export function registerUser(lastname, firstname, username, password) {
  return new Promise(((resolve, reject) => {
    cortexFetch(newaccountform, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        'family-name': lastname, 'given-name': firstname, username, password,
      }),
    }).then((res) => {
      resolve(res);
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
      reject(error);
    });
  }));
}
