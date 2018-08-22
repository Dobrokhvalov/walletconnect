// object.watch
if (!window.Object.prototype.watch) {
  window.Object.defineProperty(window.Object.prototype, 'watch', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function(prop, handler) {
      let oldval = this[prop]
      let newval = oldval
      let getter = () => newval
      let setter = val => {
        oldval = newval
        return (newval = handler.call(this, prop, oldval, val))
      }

      if (delete this[prop]) {
        window.Object.defineProperty(this, prop, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        })
      }
    }
  })
}

// object.unwatch
if (!window.Object.prototype.unwatch) {
  window.Object.defineProperty(window.Object.prototype, 'unwatch', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function(prop) {
      var val = this[prop]
      delete this[prop] // remove accessors
      this[prop] = val
    }
  })
}
