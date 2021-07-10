import axios from "axios";
import { API_BASE_URL } from "config"

export const EXECUTE_MARKET = API_BASE_URL + "/api/execute";
export const PAUSE_MARKET = API_BASE_URL + "/api/pause";
export const RESUME_MARKET = API_BASE_URL + "/api/resume";
export const CLAIM_TREASURY = API_BASE_URL + "/api/claim";
export const SET_TREASURY_RATE = API_BASE_URL + "/api/treasury-rate";

function makeTokenHeader(token) {
  const headerConfig = {
      headers: {
          Authorization: `Bearer ${token}`
      }
  }
  return headerConfig;
}

export function executeMarket(token) {
  return axios.post(EXECUTE_MARKET, {}, makeTokenHeader(token));
}

export function pauseMarket(token) {
  return axios.post(PAUSE_MARKET, {}, makeTokenHeader(token));
}

export function resumeMarket(token) {
  return axios.post(RESUME_MARKET, {}, makeTokenHeader(token));
}

export function claimTreasury(token) {
  return axios.post(CLAIM_TREASURY, {}, makeTokenHeader(token));
}

export function setTreasuryRate(token, rate) {
  return axios.post(SET_TREASURY_RATE, { rate }, makeTokenHeader(token));
}