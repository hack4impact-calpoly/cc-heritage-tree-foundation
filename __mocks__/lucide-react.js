// @ts-nocheck
// mock all lucide-react icons with empty components so don't have to create specific oness

module.exports = new Proxy(
  {},
  {
    get: (target, prop) => () => null,
  },
);

test("empty test just to pass", () => {});
