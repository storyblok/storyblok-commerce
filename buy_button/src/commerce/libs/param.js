/* eslint-disable */
export default function(val) {
  let result = ''
  let tmp = []

  location.search
    .substr(1)
    .split('&')
    .forEach(function (item) {
      tmp = item.split('=')
      if (tmp[0] === val) result = decodeURIComponent(tmp[1])
  })

  return result
}
