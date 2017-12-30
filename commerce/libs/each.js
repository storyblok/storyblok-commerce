/* eslint-disable */
export default function(object, cb) {
  for (let index in object) {
     if (object.hasOwnProperty(index)) {
         cb(object[index], index)
     }
  }
}
