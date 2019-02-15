function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export const getDateTime = function (date) {
  const YEAR = date.getFullYear();
  const mouth = date.getMonth() + 1;
  const MONTH = mouth < 10 ? `0${mouth}` : mouth;
  const day = date.getDate();
  const DAY = day < 10 ? `0${day}` : day;
  const HOUR = date.getHours();
  const MINITES = date.getMinutes();
  const SECONDS = date.getSeconds();
  return `${YEAR}-${MONTH}-${DAY} ${HOUR}:${MINITES}:${SECONDS}`;
};

export const formatDate = function (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(s+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getMilliseconds() + '').substring(0, RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    'S+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
