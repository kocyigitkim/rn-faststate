export default class FastState {
  constructor() {
    this.faststate_components = [];
    this.register = this.register.bind(this);
    for (var func of Object.getOwnPropertyNames(this.__proto__).filter(
      (p) => p != "constructor"
    )) {
      var funcValue = this[func];
      if ((typeof funcValue) == "function") {
        const binded = funcValue.bind(this);
        this[func] = (async (binded, ...args) => {
          var r = binded(...args);
          if (r instanceof Promise) {
            await r.catch(console.error);
          }
          this.update();
        }).bind(this, binded);
      }
    }
  }
  async update() {
    while (this.faststate_isupdate) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    try {
      this.faststate_isupdate = true;
      const _this = this;
      var _unregisters = [];
      this.faststate_components.forEach(item => {
        try {
          item.forceUpdate.call(item.component);
        } catch (x) {
          _unregisters.push(item.component);
        }
      })
      for (var ureg of _unregisters) {
        FastState.unregister(_this, ureg);
      }
    } catch (err) { console.error(err); }
    this.faststate_isupdate = false;
  }
  register(component) {
    this.faststate_components.push({ component: component, forceUpdate: component.forceUpdate });
  }
  use(component) {
    if (!this.isRegistered(component)) {
      this.register(component);
    }
    return this;
  }
  isRegistered(component) {
    return this.faststate_components.filter(p => p.component == component).length > 0;
  }
  static async setState(state, newState) {
    for (var k in newState) {
      state[k] = newState[k];
    }
    return await state.update();
  }
  static registerAction(state, name, action) {
    const binded = action.bind(state);
    state[name] = ((binded, ...args) => {
      binded(...args);
      this.update();
    }).bind(state, binded);
  }
  static unregister(state, component) {
    for (var i = 0; i < state.faststate_components.length; i++) {
      var c = state.faststate_components[i];
      if (c.component == component) {
        state.faststate_components.splice(i, 1);
        return;
      }
    }
  }
  static functional() {
    const [v, setV] = React.useState(0);
    return {
      v, setV, forceUpdate: () => {
        setV((v + 1) % 100);
      }
    }
  }

  static createInput(state, name) {
    const changeEvent = name + "_OnChange";
    const setAction = "set" + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (!state[changeEvent]) {
      FastState.registerAction(state, changeEvent, (value) => { state[name] = value && value.target ? value.target.value : value; });
      state[setAction] = state[changeEvent];
      state[name] = null;
    }
    return { value: (state[name] || ""), onChange: state[changeEvent] };
  }
  static createSelect(state, name) {
    const changeEvent = name + "_OnChange";
    const setAction = "set" + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (!state[changeEvent]) {
      FastState.registerAction(state, changeEvent, (value) => { state[name] = value; });
      state[setAction] = state[changeEvent];
      state[name] = null;
    }
    return { options: (state[name] || ""), onChange: state[changeEvent] };
  }
  static createDateTime(state, name) {
    const changeEvent = name + "_OnChange";
    const setAction = "set" + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (!state[changeEvent]) {
      FastState.registerAction(state, changeEvent, (value) => { state[name] = value && value.target ? value.target.value : value; });
      state[setAction] = state[changeEvent];
      state[name] = null;
    }
    return { value: (state[name] || ""), onChange: state[changeEvent] };
  }
}