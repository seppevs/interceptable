const isObject = (value) => Boolean(value) && value instanceof Object;
const noop = () => {};

module.exports = (obj, beforeInterceptor) =>
  new Proxy(obj, {
    get(target, fn) {
      const property = target[fn];
      if (property instanceof Function) {
        return (...args) => {
          const afterInterceptor = beforeInterceptor({ fn, args })();
          if (!isObject(afterInterceptor))  return property.apply(this, args);
          const onSuccess = afterInterceptor.onSuccess || noop;
          const onError = afterInterceptor.onError || noop;

          let returnedResult;
          try {
            returnedResult = property.apply(this, args);
          } catch (err) {
            onError(err);
            throw err;
          }
          if (returnedResult instanceof Promise) {
            return returnedResult
              .then((resolvedValue) => {
                onSuccess(resolvedValue);
                return resolvedValue;
              })
              .catch((rejectedValue) => {
                onError(rejectedValue);
                throw rejectedValue;
              });
          }
          onSuccess(returnedResult);
          return returnedResult;
        };
      }
      return property;
    },
  });
