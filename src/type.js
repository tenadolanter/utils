export const isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export const isUndefined = (obj) => {
  return obj === void 0;
}

export const isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]';
}

export const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export const isSymbol = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Symbol]';
}