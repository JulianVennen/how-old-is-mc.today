export function format(string: string, addSpaces = 0): string {
    const lines = string.split('\n');
    if (lines.length < 2) {
        return string;
    }

    const match = lines[1].match(/^\s+/);
    if (!match) {
        return string;
    }

    const indent = match[0];
    for (const [index, line] of lines.entries()) {
        if (line.startsWith(indent)) {
            lines[index] = ' '.repeat(addSpaces) + line.substring(indent.length);
        }
    }

    const emptyLines = lines.findIndex(a => a.length > 0);
    return lines.slice(emptyLines).join('\n');
}

export function formatTime(duration: number): string {
    const output = [];
    const units: [string, number][] = [
        ['year', 365 * 24 * 60 * 60],
        ['month', 30 * 24 * 60 * 60],
        ['day', 24 * 60 * 60],
    ];

    if (duration < 30 * 24 * 60 * 60) {
        units.push(['hour', 60 * 60]);
    }

    if (duration < 24 * 60 * 60) {
        units.push(['minute', 60], ['second', 1]);
    }

    for (let [name, factor] of units) {

        const value = Math.floor(duration / factor);
        if (value) {
            if (value !== 1) {
                name = name + 's';
            }
            output.push(`${value} ${name}`);
        }
        duration = duration % factor;
    }

    if (output.length < 2) {
        return output.join(', ');
    }

    return output.slice(0, -1).join(', ') + ' and ' + output.at(-1);
}
