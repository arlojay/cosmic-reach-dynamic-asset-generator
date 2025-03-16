/*
Copyright 2025 arlojay

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Identifier } from "./identifier";
import { Mod } from "./mod";

export enum LangKeyLanguage {
    bel_bel, bg_bg, ca_ca, ceb_ph, cs_cz, cy_gb,
    da_dk, de_de, el_el, en_pirate, en_us, eo_eo,
    es_419, es_es, et_et, fil_ph, fi_fi, fr_ca,
    fr_fr, hr_hr, hu_hu, id_id, it_it, ja_jp,
    lv_lv, nb_no, nl_be, nl_nl, nn_no, pl_pl,
    pt_br, pt_pt, ro_ro, ru_ru, scn_it, sk_sk,
    sr_sp, sv_se, tl_ph, tok, tr_tr, uk_ua, zh_cn
}

export class LangKey {
    public id: Identifier;

    public translations: Map<LangKeyLanguage, string> = new Map;

    constructor(id: Identifier) {
        this.id = id;
    }

    public addTranslation(text: string, language: LangKeyLanguage) {
        this.translations.set(language, text);
    }

    public toString() {
        return this.id.toString();
    }
}

export type SerializedLangList = Record<string, string>;
export class SerializedLanguage {
    public blocks: SerializedLangList = { };
    public items: SerializedLangList = { };
};

export class LangMap {
    private mod: Mod;
    public blocks: Set<LangKey> = new Set;
    public items: Set<LangKey> = new Set;

    public constructor(mod: Mod) {
        this.mod = mod;
    }

    public createKey(id: string) {
        return new LangKey(new Identifier(this.mod, id));
    }
    
    public createBlockKey(id: string) {
        return this.addBlockKey(this.createKey(id));
    }
    public addBlockKey(key: LangKey) {
        this.blocks.add(key);
        return key;
    }

    public createItemKey(id: string) {
        return this.addItemKey(this.createKey(id));
    }
    public addItemKey(key: LangKey) {
        this.items.add(key);
        return key;
    }

    public serialize() {
        const languages = {} as Record<LangKeyLanguage, SerializedLanguage>;

        for(const key of this.items) {
            for(const languageType of key.translations.keys()) {
                const language = languages[languageType] ??= new SerializedLanguage;
                language.items[key.toString()] = key.translations.get(languageType);
            }
        }
        for(const key of this.blocks) {
            for(const languageType of key.translations.keys()) {
                const language = languages[languageType] ??= new SerializedLanguage;
                language.blocks[key.toString()] = key.translations.get(languageType);
            }
        }

        return languages;
    }
}