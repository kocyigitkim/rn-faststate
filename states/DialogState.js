import FastState from "..";

const skip_reset_keys = ["faststate_components", "register", "show", "hide", "setLoading", "setNormal", "setSuccess", "setError", "reset", "faststate_isupdate"];

export default class DialogState extends FastState {
    constructor() {
        super();
        this.visible = false;
        this.loading = false;
        this.success = false;
        this.message = null;
        this.data = null;
    }
    show() {
        this.visible = true;
    }
    hide() {
        this.visible = false;
    }
    setLoading() {
        this.loading = true;
    }
    setNormal() {
        this.loading = false;
    }
    setSuccess(data, message) {
        this.data = data;
        this.success = true;
        this.message = message;
    }
    setError(message) {
        this.success = false;
        this.data = null;
        this.message = message;
    }
    reset() {
        for (var key of Object.getOwnPropertyNames(this).filter(p => skip_reset_keys.indexOf(p) == -1)) {
            this[key] = null;
        }
        this.visible = false;
        this.loading = false;
        this.success = false;
        this.data = null;
        this.message = null;
    }
}