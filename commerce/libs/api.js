/* eslint-disable */
import axios from 'axios'
import State from '../components/State'
let endpoint

if (window.location.search == '?local=1') {
  endpoint = 'localhost:3005'
  State.token = '3a9073a24d131fd3380d0d4a6c0ba7d4'
} else {
  endpoint = 'capi.storyblok.com'
}

export default function() {
  let client = axios.create({
    baseURL: 'https://' + endpoint + '/v1/',
    withCredentials: true,
    headers: {
      'Authorization': 'Token token=' + State.token,
      'Locale': window.SITE_LANG,
      'Currency': window.SITE_CURRENCY
    }
  })
  return client
}
