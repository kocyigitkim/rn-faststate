export default class FastState {
  constructor() {
    this.components = [];
    this.register = this.register.bind(this);
    for (var func of Object.getOwnPropertyNames(this.__proto__).filter(
      (p) => p != "constructor"
    )) {
      var funcValue = this[func];
      if ((typeof funcValue) == "function") {
        const binded = funcValue.bind(this);
        this[func] = ((binded,...args)=>{
          binded(...args);
          this.update();
        }).bind(this, binded);
      }
    }
  }
  update() {
    const _this = this;
    var _unregisters = [];
    this.components.forEach(item => {
      try {
        item.forceUpdate.call(item.component);
      } catch (x) {
        _unregisters.push(item.component);
      }
    })
    for (var ureg of _unregisters) {
      _this.unregisterComponent(ureg);
    }
  }
  register(component) {
    this.registerComponent(component);
  }
  registerComponent(component) {
    this.components.push({ component: component, forceUpdate: component.forceUpdate });
  }
  unregisterComponent(component) {
    for (var i = 0; i < this.components.length; i++) {
      var c = this.components[i];
      if (c.component == component) {
        this.components.splice(i, 1);
        return;
      }
    }
  }
}