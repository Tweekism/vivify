import { homedir } from 'os';
import { basename as pbasename, dirname as pdirname, parse as pparse } from 'path';
import config from '../parser/config.js';
import { Mime } from 'mime';
import standardTypes from 'mime/types/standard.js';
import otherTypes from 'mime/types/other.js';

export function pmime(path: string): string {
    // The 'mime' package doesn't include Jupyter notebooks, add it by extension
    // TODO: check out other mime packages to see if one does
    const mime = new Mime(standardTypes, otherTypes);
    mime.define({ 'application/json': ['ipynb'] })
    console.log(path)
    console.log(mime.getType(path) ?? "Unable to get mime type");
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
    const withoutPrefix = path.startsWith('/') ||
        path.startsWith('\\') ? path.slice(1) : path; // TODO: Windows hack!
    return `/${route}/${encodeURIComponent(withoutPrefix).replaceAll('%2F', '/')}`;
};

export const preferredPath = (path: string): string =>
    config.preferHomeTilde && path.startsWith(homedir()) ? path.replace(homedir(), '~') : path;
