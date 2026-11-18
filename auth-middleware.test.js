const test = require("node:test");
const assert = require("node:assert/strict");
const { requireAuth, requireRole } = require("../middleware/auth");

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("requireAuth rejects requests without a token with 401", async () => {
  const req = { headers: {}, cookies: {} };
  const res = responseRecorder();
  let nextCalled = false;
  await requireAuth(req, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("requireRole rejects a patron from a librarian route with 403", () => {
  const req = { user: { role: "patron" } };
  const res = responseRecorder();
  let nextCalled = false;
  requireRole("librarian")(req, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test("requireRole allows a librarian through", () => {
  const req = { user: { role: "librarian" } };
  const res = responseRecorder();
  let nextCalled = false;
  requireRole("librarian")(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
