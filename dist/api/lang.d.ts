import { Identifier } from "./identifier";
import { Mod } from "./mod";
export declare enum LangKeyLanguage {
    bel_bel = 0,
    bg_bg = 1,
    ca_ca = 2,
    ceb_ph = 3,
    cs_cz = 4,
    cy_gb = 5,
    da_dk = 6,
    de_de = 7,
    el_el = 8,
    en_pirate = 9,
    en_us = 10,
    eo_eo = 11,
    es_419 = 12,
    es_es = 13,
    et_et = 14,
    fil_ph = 15,
    fi_fi = 16,
    fr_ca = 17,
    fr_fr = 18,
    hr_hr = 19,
    hu_hu = 20,
    id_id = 21,
    it_it = 22,
    ja_jp = 23,
    lv_lv = 24,
    nb_no = 25,
    nl_be = 26,
    nl_nl = 27,
    nn_no = 28,
    pl_pl = 29,
    pt_br = 30,
    pt_pt = 31,
    ro_ro = 32,
    ru_ru = 33,
    scn_it = 34,
    sk_sk = 35,
    sr_sp = 36,
    sv_se = 37,
    tl_ph = 38,
    tok = 39,
    tr_tr = 40,
    uk_ua = 41,
    zh_cn = 42
}
export declare class LangKey {
    id: Identifier;
    translations: Map<LangKeyLanguage, string>;
    constructor(id: Identifier);
    addTranslation(text: string, language: LangKeyLanguage): void;
    toString(): string;
}
export type SerializedLangList = Record<string, string>;
export declare class SerializedLanguage {
    blocks: SerializedLangList;
    items: SerializedLangList;
}
export declare class LangMap {
    private mod;
    blocks: Set<LangKey>;
    items: Set<LangKey>;
    constructor(mod: Mod);
    createKey(id: string): LangKey;
    createBlockKey(id: string): LangKey;
    addBlockKey(key: LangKey): LangKey;
    createItemKey(id: string): LangKey;
    addItemKey(key: LangKey): LangKey;
    serialize(): Record<LangKeyLanguage, SerializedLanguage>;
}
