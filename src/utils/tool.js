export const omit = (obj, unlesskey) =>
  Object.keys(obj).reduce((acc, key) => {
    return unlesskey.includes(key) ? acc : { ...acc, [key]: obj[key] };
  }, {});

export const throttle = function (func, delay = 300) {
  let timer = null;
  let last = null;
  
  return function () {
    const context = this;
    const args = arguments;
    const now = Date.now();
    
    if (!last) last = now;
    
    if (now - last > delay) {
      last = now;
      func.apply(context, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        func.apply(context, args);
      }, delay);
    }
  };
};
