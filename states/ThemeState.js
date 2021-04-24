import FastState from "..";

export default class ThemeState extends FastState {
    themes = {};
    theme = "default";
    constructor() {
        super();
        this.get = (key)=>{
            const thm = this.themes[this.theme];
            if (thm) {
                return thm[key];
            }
            return key;
        };
    }
    define(themeName, themeDefinition) {
        this.themes[themeName] = themeDefinition;
    }
    set(themeName) {
        this.theme = themeName;
    }
}