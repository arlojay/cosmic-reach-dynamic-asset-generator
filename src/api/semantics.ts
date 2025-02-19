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