/**
 * A running buffer stored in array
 */
"use strict";

/**
 * Simple running buffer. Adds element in front of buffer.
 */
class RunningBuffer {
    constructor(size) {
        this._size = size;
        this._buffer = [];
    }

    add(element) {
        this._buffer.unshift(element);
        this._buffer = this._buffer.splice(0, this._size);
    }

    get buffer() {
        return this._buffer.slice().reverse();
    }
}

module.exports = RunningBuffer;
