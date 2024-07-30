import { execSync } from 'child_process';
import { homedir } from 'os';
import { basename as pbasename, dirname as pdirname, parse as pparse } from 'path';
import config from '../parser/config.js';
import mime from 'mime';

//export const pmime = (path: string) => execSync(`file --mime-type -b '${path}'`).toString().trim();
export function pmime(path: string): string {
    console.log(path)
    console.log(mime.getType(path) ?? "huh?");
    return mime.getType(path) ?? "";
}

export const pcomponents = (path: string) => {
    const parsed = pparse(path);
    const components = new Array<string>();
    // directory
    let dir = parsed.dir;
    while (dir !== '/' && dir !== '.') {
        components.unshift(pbasename(dir));
        dir = pdirname(dir);
    }
    // root
    if (parsed.root !== '') components.unshift(parsed.root);
    // base
    if (parsed.base !== '') components.push(parsed.base);
    return components;
};

export const absPath = (path: string) => path.replace(/^\/~/, homedir()).replace(/\/+$/, '');

export const urlToPath = (url: string) => {
    const path = absPath(decodeURIComponent(url.replace(/^\/(viewer|health)/, '')));
    return path === '' ? '/' : path;
};

export const pathToURL = (path: string, route: string = 'viewer') => {
    const withoutPrefix = path.startsWith('/') ? path.slice(1) : path;
    return `/${route}/${encodeURIComponent(withoutPrefix).replaceAll('%2F', '/')}`;
};

export const preferredPath = (path: string): string =>
    config.preferHomeTilde && path.startsWith(homedir()) ? path.replace(homedir(), '~') : path;
