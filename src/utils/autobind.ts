export {};
declare global {
  function AutoBind(target: any): any;
}

global.AutoBind = function (target: any) {
  // save a reference to the original constructor
  const original = target;

  // new constructor behaviour
  const f: any = function (...args: any[]) {
    const result = new original(...args);
    // auto bind methods
    for (const key of Object.getOwnPropertyNames(
      Object.getPrototypeOf(result)
    )) {
      const val = result[key];
      if (typeof val === "function") {
        result[key] = val.bind(result);
      }
    }
    return result;
  };

  // copy prototype so instanceof operator still works
  f.prototype = original.prototype;

  // return new constructor (will override original)
  return f;
};
