import assert from 'node:assert/strict'
import assertDefault, { assert as isAssert, deepStrictEqual } from 'node:assert/strict'
import {
  assert as multilineAssert,
  deepStrictEqual as multilineDeepStrictEqual,
} from 'node:assert/strict'

// assert stays a comment, and imported assert remains an identifier.
assert.equal(assertDefault, assert)
isAssert(multilineAssert)
multilineDeepStrictEqual(deepStrictEqual, assert)
