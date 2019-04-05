export class LocalStoragePolyfill {

    private _data = {};

    constructor() {
        this._data = {};
    }

    setItem(id, val: string) {
        return this._data[id] = String(val);
    }

    getItem(id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : null;
    }

    removeItem(id) {
        delete this._data[id];
    }

    clear() {
        return this._data = {};
    }
}
