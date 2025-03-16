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

export function formatId(id: string, proper: boolean = true) {
    const sections = id.split(/[_\-\s]/g);
    const final: string[] = new Array;

    for(let i = 0; i < sections.length; i++) {
        const section = sections[i];

        if(i == 0 || proper)
            final.push(section[0].toUpperCase() + section.slice(1).toLowerCase());
        else
            final.push(section.toLowerCase());
    }

    return final.join(" ");
}