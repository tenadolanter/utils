import { isArray, isSymbol, isObject } from "./type.js";

/**
 * 克隆对象
 * @param { Object } - target 需要克隆的对象
 * @param { Map } - cache 缓存对象
 */
export const cloneDeep = (target, cache = new Map()) => {
  const getProtoCls = (target) => {
    const proto = Object.prototype.toString.call(target);
    return /^\[object (.*)\]$/.exec(proto)[1];
  };
  const cls = getProtoCls(target);
  const isFunc = typeof target === "function";
  const isObject = (obj) =>
    obj !== null && (typeof obj === "object" || typeof obj === "function");
  const isSpec = ["Date", "RegExp", "Map", "Set"].includes(cls);
  // 基础类型时候直接返回，如function、undefined、symbol、bigint、number、string、boolean
  if (isFunc(target) && !isObject(target)) {
    return target;
  } else if (isSpec) {
    const Ctor = target.prototype;
    const primeValue = target.valueOf();
    if (["Date"].includes(cls)) {
      return new Ctor(primeValue);
    } else if (["RegExp"].includes(cls)) {
      const { source, flags, lastIndex } = target;
      const re = new RegExp(source, flags);
      re.lastIndex = lastIndex;
      return re;
    } else if (["Map"].includes(cls)) {
      const map = new Ctor();
      obj.forEach((item, key) => {
        map.set(key, cloneDeep(item, cache));
      });
      return map;
    } else if (["Set"].includes(cls)) {
      const set = new Ctor();
      obj.forEach((item) => {
        set.add(cloneDeep(item, cache));
      });
      return set;
    }
  } else if (["Array", "Object"].includes(cls)) {
    let cloneTarget = cls === "Array" ? [] : {};
    if (cache.has(target)) {
      return cache.get(target);
    }
    cache.set(target, cloneTarget);
    Reflect.ownKeys(target).forEach((key) => {
      if (target.propertyIsEnumerable(key)) {
        cloneTarget[key] = cloneDeep(target[key], cache);
      }
    });
    return cloneTarget;
  }
};

/**
 * 判断两个值是否相等
 * @param { Any } - target 需要比较的值
 * @param { Any } - source 需要比较的值
 */
export const isEqual = (target, source) => {
  if (target === source) return true;
  const loopEqual = (target, source) => {
    if (isSymbol(target) || isSymbol(source)) return false;
    if (isObject(target) && isObject(source)) {
      return JSON.stringify(target) === JSON.stringify(source);
    }
    return false;
  };
  const arrayEqual = (target, source) => {
    const targetLen = target.length;
    if (targetLen !== source.length) return false;
    for (let i = 0; i < targetLen; i++) {
      if (!loopEqual(target[i], source[i])) {
        return false;
      }
    }
    return true;
  };
  if (isArray(target) && isArray(source)) {
    return arrayEqual(target, source);
  }
  return loopEqual(target, source);
};

/**
 * 等待指定时间
 * @param { number } - 延时时间，单位ms
 * @returns { Promise<void> } - 返回Promise
 */
export const sleep = async (ms = 200) => {
  let timer;
  return new Promise((resolve) => (timer = setTimeout(resolve, ms))).finally(
    () => {
      if (timer) clearTimeout(timer);
    }
  );
};

/**
 * 循环执行某个方法
 * @param { Function } - execFn 需要循环执行的方法
 * @param { Function } - stopFn 控制循环停止的方法
 * @param { number } - interval 循环间隔时间，单位ms
 *
 */
export const loop = (execFn, stopFn, interval = 1000) => {
  if (typeof execFn !== "function") {
    throw new Error("execFn 必须是一个方法");
  }
  if (typeof stopFn !== "function") {
    throw new Error("stopFn 必须是一个方法");
  }
  if (typeof interval !== "number" || interval <= 0) {
    throw new Error("interval 必须是一个大于 0 的正整数");
  }
  let timer;
  const loopInner = async () => {
    await execFn();
    if (stopFn()) {
      console.info("停止循环");
      clearTimeout(timer);
    } else {
      timer = setTimeout(loopInner, interval);
    }
  };
  console.info("开始循环");
  loopInner();
  return timer;
};

/**
 * 数组转树结构
 * @param { Array } - list 需要转换的数组
 * @param { string } - id 唯一标识
 * @param { string } - pid 父级标识
 * @param { string } - children 子级标识
 */
export const list2Tree = (
  list,
  id = "id",
  pid = "pid",
  children = "children"
) => {
  if (!Array.isArray(list)) return [];
  const dict = list.reduce(
    (total, item) =>
      [(item[children] = []), (total["" + item?.[id]] = item), total][2],
    {}
  );
  return list.reduce((total, item) => {
    if (dict[item?.[pid]]) {
      dict[item?.[pid]]?.[children].push(item);
    } else {
      total.push(item);
    }
    return total;
  }, []);
};

/**
 * 遍历树结构
 * @param { Array } - tree 需要遍历的树结构
 * @param { string } - children 子级标识
 * @param { Function } - callback 回调函数
 */
export const traverseTree = (tree, children = "children", callback) => {
  if (!Array.isArray(tree)) return [];
  return tree.map((item) => {
    let result = callback(item);
    result[children] = traverseTree(item?.[children] ?? [], children, callback);
    return result;
  });
};
