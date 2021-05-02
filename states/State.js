import FastState from '..'

export default class State extends FastState {
    constructor(...args) {
        super();
        for (var a of args) {
            this[a] = args;
        }
    }
}