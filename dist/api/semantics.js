"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatId = formatId;
function formatId(id, proper = true) {
    const sections = id.split(/[_\-\s]/g);
    const final = new Array;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (i == 0 || proper)
            final.push(section[0].toUpperCase() + section.slice(1).toLowerCase());
        else
            final.push(section.toLowerCase());
    }
    return final.join(" ");
}
