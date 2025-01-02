import { toCamelCase } from "./string.js";
export const hasClass = (el, cls) => {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
};

export const addClass = (el, cls) => {
  if (!el || !cls) return;
  var curClass = el.className;
  var classes = (cls || "").split(" ");

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

export const removeClass = (el, cls) => {
  if (!el || !cls) return;
  var classes = cls.split(" ");
  var curClass = " " + el.className + " ";

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

export const getStyle = (el, styleName) => {
  if (!el || !styleName) return null;
  styleName = toCamelCase(styleName);
  if (styleName === "float") {
    styleName = "cssFloat";
  }
  try {
    var computed = document.defaultView.getComputedStyle(el, "");
    return el.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return el.style[styleName];
  }
};

export const setStyle = (el, styleName, value) => {
  if (!el || !styleName) return;

  if (typeof styleName === "object") {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(el, prop, styleName[prop]);
      }
    }
  } else {
    styleName = toCamelCase(styleName);
    if (styleName === "opacity" && ieVersion < 9) {
      el.style.filter = isNaN(value)
        ? ""
        : "alpha(opacity=" + value * 100 + ")";
    } else {
      el.style[styleName] = value;
    }
  }
};
