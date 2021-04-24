import FastState from "..";

export default class LocalizationState extends FastState {
    languages = {};
    language = null;
    constructor() {
        super();
        this.get = (key)=>{
            const lang = this.languages[this.language];
            if (lang) {
                return lang[key];
            }
            return key;
        };
    }
    define(langCode, langDefinition) {
        this.languages[langCode] = langDefinition;
    }
    set(langCode) {
        this.language = langCode;
    }
}