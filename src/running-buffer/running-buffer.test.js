/** Test connection-status module */
/* global test, expect */
const RunningBuffer = require("./running-buffer");

test("Buffer init to zero elements", () => {
    expect(new RunningBuffer(10).buffer).toEqual([]);
});

test("Buffer should contain 3 items", () => {
    const b = new RunningBuffer(10);

    b.add(1);
    b.add(2);
    b.add(3);
    expect(b.buffer).toEqual([1, 2, 3]);
});

test("Buffer of size 2 should contain 2 items but 3 where added", () => {
    const b = new RunningBuffer(2);

    b.add(1);
    b.add(2);
    b.add(3);
    expect(b.buffer).toEqual([2, 3]);
});
