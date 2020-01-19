// Accects `obj`, ideally a JSON-parsed data structure returned from a RESTful
// API
module.exports = function accessCounter(obj) {
  if (obj === null || typeof obj !== 'object') {
    return [obj, function() {}]
  }

  var ACCESS_REF = Symbol('ACCESS_REF')
  var handler = {
    get: function(obj, prop, receiver) {
      var value = obj[prop]

      if (value !== null && typeof value === 'object') {
        if (!obj[ACCESS_REF][prop]) {
          obj[ACCESS_REF][prop] = value[ACCESS_REF] = Array.isArray(value)
            ? []
            : {}
        }

        return new Proxy(value, handler)
      }

      if (prop in obj && typeof value !== 'function') {
        obj[ACCESS_REF][prop] = value
      }

      return value
    },
    set: function(obj, prop, value) {
      if (prop === ACCESS_REF) {
        obj[prop] = value
        return value
      }

      throw new Error('set not implemented')
    },
    delete: function() {
      throw new Error('delete not implemented')
    }
  }

  // Track accessed properties to `obj`
  var accessed = Array.isArray(obj) ? [] : {}
  var newTarget = Object.create(obj)
  Object.defineProperty(newTarget, ACCESS_REF, {
    enumerable: false,
    value: accessed
  })
  var proxy = new Proxy(newTarget, handler)

  return [
    proxy,
    function() {
      return accessed
    }
  ]
}
