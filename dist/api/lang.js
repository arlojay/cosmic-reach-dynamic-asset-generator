"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangMap = exports.SerializedLanguage = exports.LangKey = exports.LangKeyLanguage = void 0;
const identifier_1 = require("./identifier");
var LangKeyLanguage;
(function (LangKeyLanguage) {
    LangKeyLanguage[LangKeyLanguage["bel_bel"] = 0] = "bel_bel";
    LangKeyLanguage[LangKeyLanguage["bg_bg"] = 1] = "bg_bg";
    LangKeyLanguage[LangKeyLanguage["ca_ca"] = 2] = "ca_ca";
    LangKeyLanguage[LangKeyLanguage["ceb_ph"] = 3] = "ceb_ph";
    LangKeyLanguage[LangKeyLanguage["cs_cz"] = 4] = "cs_cz";
    LangKeyLanguage[LangKeyLanguage["cy_gb"] = 5] = "cy_gb";
    LangKeyLanguage[LangKeyLanguage["da_dk"] = 6] = "da_dk";
    LangKeyLanguage[LangKeyLanguage["de_de"] = 7] = "de_de";
    LangKeyLanguage[LangKeyLanguage["el_el"] = 8] = "el_el";
    LangKeyLanguage[LangKeyLanguage["en_pirate"] = 9] = "en_pirate";
    LangKeyLanguage[LangKeyLanguage["en_us"] = 10] = "en_us";
    LangKeyLanguage[LangKeyLanguage["eo_eo"] = 11] = "eo_eo";
    LangKeyLanguage[LangKeyLanguage["es_419"] = 12] = "es_419";
    LangKeyLanguage[LangKeyLanguage["es_es"] = 13] = "es_es";
    LangKeyLanguage[LangKeyLanguage["et_et"] = 14] = "et_et";
    LangKeyLanguage[LangKeyLanguage["fil_ph"] = 15] = "fil_ph";
    LangKeyLanguage[LangKeyLanguage["fi_fi"] = 16] = "fi_fi";
    LangKeyLanguage[LangKeyLanguage["fr_ca"] = 17] = "fr_ca";
    LangKeyLanguage[LangKeyLanguage["fr_fr"] = 18] = "fr_fr";
    LangKeyLanguage[LangKeyLanguage["hr_hr"] = 19] = "hr_hr";
    LangKeyLanguage[LangKeyLanguage["hu_hu"] = 20] = "hu_hu";
    LangKeyLanguage[LangKeyLanguage["id_id"] = 21] = "id_id";
    LangKeyLanguage[LangKeyLanguage["it_it"] = 22] = "it_it";
    LangKeyLanguage[LangKeyLanguage["ja_jp"] = 23] = "ja_jp";
    LangKeyLanguage[LangKeyLanguage["lv_lv"] = 24] = "lv_lv";
    LangKeyLanguage[LangKeyLanguage["nb_no"] = 25] = "nb_no";
    LangKeyLanguage[LangKeyLanguage["nl_be"] = 26] = "nl_be";
    LangKeyLanguage[LangKeyLanguage["nl_nl"] = 27] = "nl_nl";
    LangKeyLanguage[LangKeyLanguage["nn_no"] = 28] = "nn_no";
    LangKeyLanguage[LangKeyLanguage["pl_pl"] = 29] = "pl_pl";
    LangKeyLanguage[LangKeyLanguage["pt_br"] = 30] = "pt_br";
    LangKeyLanguage[LangKeyLanguage["pt_pt"] = 31] = "pt_pt";
    LangKeyLanguage[LangKeyLanguage["ro_ro"] = 32] = "ro_ro";
    LangKeyLanguage[LangKeyLanguage["ru_ru"] = 33] = "ru_ru";
    LangKeyLanguage[LangKeyLanguage["scn_it"] = 34] = "scn_it";
    LangKeyLanguage[LangKeyLanguage["sk_sk"] = 35] = "sk_sk";
    LangKeyLanguage[LangKeyLanguage["sr_sp"] = 36] = "sr_sp";
    LangKeyLanguage[LangKeyLanguage["sv_se"] = 37] = "sv_se";
    LangKeyLanguage[LangKeyLanguage["tl_ph"] = 38] = "tl_ph";
    LangKeyLanguage[LangKeyLanguage["tok"] = 39] = "tok";
    LangKeyLanguage[LangKeyLanguage["tr_tr"] = 40] = "tr_tr";
    LangKeyLanguage[LangKeyLanguage["uk_ua"] = 41] = "uk_ua";
    LangKeyLanguage[LangKeyLanguage["zh_cn"] = 42] = "zh_cn";
})(LangKeyLanguage || (exports.LangKeyLanguage = LangKeyLanguage = {}));
class LangKey {
    id;
    translations = new Map;
    constructor(id) {
        this.id = id;
    }
    addTranslation(text, language) {
        this.translations.set(language, text);
    }
    toString() {
        return this.id.toString();
    }
}
exports.LangKey = LangKey;
class SerializedLanguage {
    blocks = {};
    items = {};
}
exports.SerializedLanguage = SerializedLanguage;
;
class LangMap {
    mod;
    blocks = new Set;
    items = new Set;
    constructor(mod) {
        this.mod = mod;
    }
    createKey(id) {
        return new LangKey(new identifier_1.Identifier(this.mod, id));
    }
    createBlockKey(id) {
        return this.addBlockKey(this.createKey(id));
    }
    addBlockKey(key) {
        this.blocks.add(key);
        return key;
    }
    createItemKey(id) {
        return this.addItemKey(this.createKey(id));
    }
    addItemKey(key) {
        this.items.add(key);
        return key;
    }
    serialize() {
        const languages = {};
        for (const key of this.items) {
            for (const languageType of key.translations.keys()) {
                const language = languages[languageType] ??= new SerializedLanguage;
                language.items[key.toString()] = key.translations.get(languageType);
            }
        }
        for (const key of this.blocks) {
            for (const languageType of key.translations.keys()) {
                const language = languages[languageType] ??= new SerializedLanguage;
                language.blocks[key.toString()] = key.translations.get(languageType);
            }
        }
        return languages;
    }
}
exports.LangMap = LangMap;
