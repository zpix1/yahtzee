export function getRandomInt (min, max) {
  var byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray)

  var range = max - min + 1
  var maxRange = 256
  if (byteArray[0] >= Math.floor(maxRange / range) * range) {
    return getRandomInt(min, max)
  }
  return min + (byteArray[0] % range)
}
