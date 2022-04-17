import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const AccountKey = 'Admin-Account'
const OpenIdKey = 'Client-OpenId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setAccount(account_id) {
  return Cookies.set(AccountKey, account_id)
}

export function getAccount() {
  return Cookies.get(AccountKey)
}

export function setOpenId(open_id) {
  return Cookies.set(OpenIdKey, open_id)
}

export function getOpenId() {
  return Cookies.get(OpenIdKey)
}
