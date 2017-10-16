/**
 * A running buffer stored in array
 */
"use strict";

/**
 * Simple running buffer. Adds element in front of buffer.
 */
class RunningBuffer {
    /**
     * @param size int - buffer size.
     */
    constructor(size) {
        this._size = size;
        this._buffer = [];
    }

    /**
     * Adds element to buffer
     *
     * @param element - Any
     */
    add(element) {
        this._buffer.unshift(element);
        this._buffer = this._buffer.splice(0, this._size);
    }

    /**
     * Get a copy of elements in the buffer.
     *
     * @return array
     */
    get buffer() {
        return this._buffer.slice().reverse();
    }
}

module.exports = RunningBuffer;
