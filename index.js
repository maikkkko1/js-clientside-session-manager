/**
 * @author Maikon Ferreira
 * @email mai.kon96@hotmail.com
 * @create date 2020-01-24 13:04:21
 * @modify date 2020-01-24 13:04:21
 * @desc Client-side session manager.
 */

'use strict';

const SESSION_DATA_KEY = '__session_f0b0d9caeeac416c7f1a79195a1313c1';
const SESSION_TOKEN_KEY = '__session_0b01d74c11d6d2f5c03afc0ce733510e';

export default class SessionManager {
  /**
   * Create a new session.
   * @param {string} token - Access token.
   * @param {object} data - Object with user data.
   * @param {number} timeExpire - Minutes to session expire.
   */
  static create(token, data, timeExpire) {
    if (data != null && data != undefined) {
      localStorage.setItem(SESSION_DATA_KEY, btoa(JSON.stringify(data)));
      localStorage.setItem(SESSION_TOKEN_KEY, token);

      if (timeExpire != undefined && timeExpire != null) {
        this.addDetail('session_time', timeExpire);
        this.addDetail('expire_at', this._getExpireDate(timeExpire));
      }
    }
  }

  /**
   * Return the full user data object.
   * @return {object}
   * */
  static getAll() {
    let data = localStorage.getItem(SESSION_DATA_KEY);

    if (data != null && data != undefined) {
      return JSON.parse(atob(data));
    }

    return null;
  }

  /**
   * Return a unique information from user data.
   * @param {string} detailKey
   * @return {*}
   */
  static getDetail(detailKey) {
    let data = localStorage.getItem(SESSION_DATA_KEY);

    if (data != null && data != undefined) {
      data = JSON.parse(atob(data));

      if (detailKey in data) {
        return data[detailKey];
      }

      return null;
    }

    return null;
  }

  /**
   * Return the access token.
   * @return {string}
   * */
  static getToken() {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  }

  /**
   * Check if an active session exists.
   * @return {boolean}
   */
  static exists() {
    const data = localStorage.getItem(SESSION_DATA_KEY);
    const key = localStorage.getItem(SESSION_TOKEN_KEY);

    let exists =
      data == null || data == undefined || key == null || key == undefined
        ? false
        : true;

    if (!exists) {
      localStorage.removeItem(SESSION_DATA_KEY);
      localStorage.removeItem(SESSION_TOKEN_KEY);
    } else {
      if (this._verifySessionExpired()) {
        this.destroy(true);
      } else {
        return true;
      }
    }

    return false;
  }

  /**
   * Updates the access token and when the session will expire.
   * @param {string} token
   */
  static updateToken(token) {
    let data = localStorage.getItem(SESSION_DATA_KEY);

    if (data != null && data != undefined) {
      data = JSON.parse(atob(data));

      if ('expire_at' in data && 'session_time' in data) {
        this.updateDetail(
          'expire_at',
          this._getExpireDate(data['session_time'])
        );
      }
    }

    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }

  /**
   * Update a unique information in user data.
   * @param {string} detailKey
   * @param {*} newValue
   */
  static updateDetail(detailKey, newValue) {
    if (this.exists()) {
      let data = localStorage.getItem(SESSION_DATA_KEY);

      if (data != null && data != undefined) {
        data = JSON.parse(atob(data));

        if (detailKey in data) {
          data[detailKey] = newValue;
          localStorage.setItem(SESSION_DATA_KEY, btoa(JSON.stringify(data)));
        }
      }
    }
  }

  /**
   * Add a new information in user data.
   * @param {string} detailKey
   * @param {*} value
   */
  static addDetail(detailKey, value) {
    if (this.exists()) {
      let data = localStorage.getItem(SESSION_DATA_KEY);

      if (data != null && data != undefined) {
        data = JSON.parse(atob(data));

        data[detailKey] = value;
        localStorage.setItem(SESSION_DATA_KEY, btoa(JSON.stringify(data)));
      }
    }
  }

  /**
   * Destroy the current active session.
   * @param {boolean} reload
   */
  static destroy(reload) {
    localStorage.removeItem(SESSION_DATA_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);

    if (reload) {
      window.location.reload();
    }
  }

  /**
   * Check if the session is expired.
   * @return {boolean}
   */
  static _verifySessionExpired() {
    const expireAt = this.getDetail('expire_at');

    if (expireAt != null && expireAt != undefined) {
      let baseDate = new Date();
      let actualDate = new Date(
        baseDate.valueOf() - baseDate.getTimezoneOffset() * 60000
      );

      return new Date(expireAt) < actualDate;
    }

    return false;
  }

  /**
   * Return the datetime when the session will expire.
   * @param {int} minutesToExpire
   * @return {string}
   */
  static _getExpireDate(minutesToExpire) {
    let baseDate = new Date();
    let date = new Date(
      baseDate.valueOf() - baseDate.getTimezoneOffset() * 60000
    );

    return new Date(date.getTime() + minutesToExpire * 60000).toISOString();
  }
}
