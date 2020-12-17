const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
function code(open, close) {
  return {
    open: `\x1b[${open.join(';')}m`,
    close: `\x1b[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, 'g'),
  };
}
function run(str, code1) {
  return enabled
    ? `${code1.open}${str.replace(code1.regexp, code1.open)}${code1.close}`
    : str;
}
function bold(str) {
  return run(str, code([1], 22));
}
function red(str) {
  return run(str, code([31], 39));
}
function green(str) {
  return run(str, code([32], 39));
}
function white(str) {
  return run(str, code([37], 39));
}
function gray(str) {
  return brightBlack(str);
}
function brightBlack(str) {
  return run(str, code([90], 39));
}
function clampAndTruncate(n, max = 255, min = 0) {
  return Math.trunc(Math.max(Math.min(n, max), min));
}
const ANSI_PATTERN = new RegExp(
  [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|'),
  'g'
);
function stripColor(string) {
  return string.replace(ANSI_PATTERN, '');
}
var DiffType;
(function (DiffType1) {
  DiffType1['removed'] = 'removed';
  DiffType1['common'] = 'common';
  DiffType1['added'] = 'added';
})(DiffType || (DiffType = {}));
function createCommon(A, B, reverse) {
  const common = [];
  if (A.length === 0 || B.length === 0) return [];
  for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
    if (
      A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]
    ) {
      common.push(A[reverse ? A.length - i - 1 : i]);
    } else {
      return common;
    }
  }
  return common;
}
function diff(A, B) {
  const prefixCommon = createCommon(A, B);
  const suffixCommon = createCommon(
    A.slice(prefixCommon.length),
    B.slice(prefixCommon.length),
    true
  ).reverse();
  A = suffixCommon.length
    ? A.slice(prefixCommon.length, -suffixCommon.length)
    : A.slice(prefixCommon.length);
  B = suffixCommon.length
    ? B.slice(prefixCommon.length, -suffixCommon.length)
    : B.slice(prefixCommon.length);
  const swapped = B.length > A.length;
  [A, B] = swapped ? [B, A] : [A, B];
  const M = A.length;
  const N = B.length;
  if (!M && !N && !suffixCommon.length && !prefixCommon.length) return [];
  if (!N) {
    return [
      ...prefixCommon.map((c) => ({
        type: DiffType.common,
        value: c,
      })),
      ...A.map((a) => ({
        type: swapped ? DiffType.added : DiffType.removed,
        value: a,
      })),
      ...suffixCommon.map((c) => ({
        type: DiffType.common,
        value: c,
      })),
    ];
  }
  const offset = N;
  const delta = M - N;
  const size = M + N + 1;
  const fp = new Array(size).fill({
    y: -1,
  });
  const routes = new Uint32Array((M * N + size + 1) * 2);
  const diffTypesPtrOffset = routes.length / 2;
  let ptr = 0;
  let p = -1;
  function backTrace(A1, B1, current, swapped1) {
    const M1 = A1.length;
    const N1 = B1.length;
    const result = [];
    let a = M1 - 1;
    let b = N1 - 1;
    let j = routes[current.id];
    let type = routes[current.id + diffTypesPtrOffset];
    while (true) {
      if (!j && !type) break;
      const prev = j;
      if (type === 1) {
        result.unshift({
          type: swapped1 ? DiffType.removed : DiffType.added,
          value: B1[b],
        });
        b -= 1;
      } else if (type === 3) {
        result.unshift({
          type: swapped1 ? DiffType.added : DiffType.removed,
          value: A1[a],
        });
        a -= 1;
      } else {
        result.unshift({
          type: DiffType.common,
          value: A1[a],
        });
        a -= 1;
        b -= 1;
      }
      j = routes[j];
      type = routes[j + diffTypesPtrOffset];
    }
    return result;
  }
  function createFP(slide, down, k, M1) {
    if (slide && slide.y === -1 && down && down.y === -1) {
      return {
        y: 0,
        id: 0,
      };
    }
    if (
      (down && down.y === -1) ||
      k === M1 ||
      (slide && slide.y) > (down && down.y) + 1
    ) {
      const prev = slide.id;
      ptr++;
      routes[ptr] = prev;
      routes[ptr + diffTypesPtrOffset] = 3;
      return {
        y: slide.y,
        id: ptr,
      };
    } else {
      const prev = down.id;
      ptr++;
      routes[ptr] = prev;
      routes[ptr + diffTypesPtrOffset] = 1;
      return {
        y: down.y + 1,
        id: ptr,
      };
    }
  }
  function snake(k, slide, down, _offset, A1, B1) {
    const M1 = A1.length;
    const N1 = B1.length;
    if (k < -N1 || M1 < k)
      return {
        y: -1,
        id: -1,
      };
    const fp1 = createFP(slide, down, k, M1);
    while (fp1.y + k < M1 && fp1.y < N1 && A1[fp1.y + k] === B1[fp1.y]) {
      const prev = fp1.id;
      ptr++;
      fp1.id = ptr;
      fp1.y += 1;
      routes[ptr] = prev;
      routes[ptr + diffTypesPtrOffset] = 2;
    }
    return fp1;
  }
  while (fp[delta + N].y < N) {
    p = p + 1;
    for (let k = -p; k < delta; ++k) {
      fp[k + offset] = snake(k, fp[k - 1 + N], fp[k + 1 + N], N, A, B);
    }
    for (let k1 = delta + p; k1 > delta; --k1) {
      fp[k1 + offset] = snake(k1, fp[k1 - 1 + N], fp[k1 + 1 + N], N, A, B);
    }
    fp[delta + offset] = snake(
      delta,
      fp[delta - 1 + N],
      fp[delta + 1 + N],
      N,
      A,
      B
    );
  }
  return [
    ...prefixCommon.map((c) => ({
      type: DiffType.common,
      value: c,
    })),
    ...backTrace(A, B, fp[delta + N], swapped),
    ...suffixCommon.map((c) => ({
      type: DiffType.common,
      value: c,
    })),
  ];
}
export class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}
export function _format(v) {
  return globalThis.Deno
    ? Deno.inspect(v, {
        depth: Infinity,
        sorted: true,
        trailingComma: true,
        compact: false,
        iterableLimit: Infinity,
      })
    : `"${String(v).replace(/(?=["\\])/g, '\\')}"`;
}
function createColor(diffType) {
  switch (diffType) {
    case DiffType.added:
      return (s) => green(bold(s));
    case DiffType.removed:
      return (s) => red(bold(s));
    default:
      return white;
  }
}
function createSign(diffType) {
  switch (diffType) {
    case DiffType.added:
      return '+   ';
    case DiffType.removed:
      return '-   ';
    default:
      return '    ';
  }
}
function buildMessage(diffResult) {
  const messages = [];
  messages.push('');
  messages.push('');
  messages.push(
    `    ${gray(bold('[Diff]'))} ${red(bold('Actual'))} / ${green(
      bold('Expected')
    )}`
  );
  messages.push('');
  messages.push('');
  diffResult.forEach((result) => {
    const c = createColor(result.type);
    messages.push(c(`${createSign(result.type)}${result.value}`));
  });
  messages.push('');
  return messages;
}
function isKeyedCollection(x) {
  return [Symbol.iterator, 'size'].every((k) => k in x);
}
export function equal(c, d) {
  const seen = new Map();
  return (function compare(a, b) {
    if (
      a &&
      b &&
      ((a instanceof RegExp && b instanceof RegExp) ||
        (a instanceof URL && b instanceof URL))
    ) {
      return String(a) === String(b);
    }
    if (a instanceof Date && b instanceof Date) {
      const aTime = a.getTime();
      const bTime = b.getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
        return true;
      }
      return a.getTime() === b.getTime();
    }
    if (Object.is(a, b)) {
      return true;
    }
    if (a && typeof a === 'object' && b && typeof b === 'object') {
      if (seen.get(a) === b) {
        return true;
      }
      if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
        return false;
      }
      if (isKeyedCollection(a) && isKeyedCollection(b)) {
        if (a.size !== b.size) {
          return false;
        }
        let unmatchedEntries = a.size;
        for (const [aKey, aValue] of a.entries()) {
          for (const [bKey, bValue] of b.entries()) {
            if (
              (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
              (compare(aKey, bKey) && compare(aValue, bValue))
            ) {
              unmatchedEntries--;
            }
          }
        }
        return unmatchedEntries === 0;
      }
      const merged = {
        ...a,
        ...b,
      };
      for (const key in merged) {
        if (!compare(a && a[key], b && b[key])) {
          return false;
        }
      }
      seen.set(a, b);
      return true;
    }
    return false;
  })(c, d);
}
export function assert(expr, msg = '') {
  if (!expr) {
    throw new AssertionError(msg);
  }
}
export function strictEqual(actual, expected, msg) {
  if (equal(actual, expected)) {
    return;
  }
  let message1 = '';
  const actualString = _format(actual);
  const expectedString = _format(expected);
  try {
    const diffResult = diff(
      actualString.split('\n'),
      expectedString.split('\n')
    );
    const diffMsg = buildMessage(diffResult).join('\n');
    message1 = `Values are not equal:\n${diffMsg}`;
  } catch (e) {
    message1 = `\n${red('[Cannot display]')} + \n\n`;
  }
  if (msg) {
    message1 = msg;
  }
  throw new AssertionError(message1);
}
export function assertNotEquals(actual, expected, msg) {
  if (!equal(actual, expected)) {
    return;
  }
  let actualString;
  let expectedString;
  try {
    actualString = String(actual);
  } catch (e) {
    actualString = '[Cannot display]';
  }
  try {
    expectedString = String(expected);
  } catch (e) {
    expectedString = '[Cannot display]';
  }
  if (!msg) {
    msg = `actual: ${actualString} expected: ${expectedString}`;
  }
  throw new AssertionError(msg);
}
export function assertStrictEquals(actual, expected, msg) {
  if (actual === expected) {
    return;
  }
  let message1;
  if (msg) {
    message1 = msg;
  } else {
    const actualString = _format(actual);
    const expectedString = _format(expected);
    if (actualString === expectedString) {
      const withOffset = actualString
        .split('\n')
        .map((l) => `    ${l}`)
        .join('\n');
      message1 = `Values have the same structure but are not reference-equal:\n\n${red(
        withOffset
      )}\n`;
    } else {
      try {
        const diffResult = diff(
          actualString.split('\n'),
          expectedString.split('\n')
        );
        const diffMsg = buildMessage(diffResult).join('\n');
        message1 = `Values are not strictly equal:\n${diffMsg}`;
      } catch (e) {
        message1 = `\n${red('[Cannot display]')} + \n\n`;
      }
    }
  }
  throw new AssertionError(message1);
}
export function assertNotStrictEquals(actual, expected, msg) {
  if (actual !== expected) {
    return;
  }
  throw new AssertionError(
    msg ?? `Expected "actual" to be strictly unequal to: ${_format(actual)}\n`
  );
}
export function assertExists(actual, msg) {
  if (actual === undefined || actual === null) {
    if (!msg) {
      msg = `actual: "${actual}" expected to match anything but null or undefined`;
    }
    throw new AssertionError(msg);
  }
}
export function assertStringIncludes(actual, expected, msg) {
  if (!actual.includes(expected)) {
    if (!msg) {
      msg = `actual: "${actual}" expected to contain: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
export function assertArrayIncludes(actual, expected, msg) {
  const missing = [];
  for (let i = 0; i < expected.length; i++) {
    let found = false;
    for (let j = 0; j < actual.length; j++) {
      if (equal(expected[i], actual[j])) {
        found = true;
        break;
      }
    }
    if (!found) {
      missing.push(expected[i]);
    }
  }
  if (missing.length === 0) {
    return;
  }
  if (!msg) {
    msg = `actual: "${_format(actual)}" expected to include: "${_format(
      expected
    )}"\nmissing: ${_format(missing)}`;
  }
  throw new AssertionError(msg);
}
export function assertMatch(actual, expected, msg) {
  if (!expected.test(actual)) {
    if (!msg) {
      msg = `actual: "${actual}" expected to match: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
export function assertNotMatch(actual, expected, msg) {
  if (expected.test(actual)) {
    if (!msg) {
      msg = `actual: "${actual}" expected to not match: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
export function assertObjectMatch(actual, expected) {
  const seen = new WeakMap();
  return strictEqual(
    (function filter(a, b) {
      if (seen.has(a) && seen.get(a) === b) {
        return a;
      }
      seen.set(a, b);
      const filtered = {};
      const entries = [
        ...Object.getOwnPropertyNames(a),
        ...Object.getOwnPropertySymbols(a),
      ]
        .filter((key) => key in b)
        .map((key) => [key, a[key]]);
      for (const [key, value] of entries) {
        if (typeof value === 'object') {
          const subset = b[key];
          if (typeof subset === 'object' && subset) {
            filtered[key] = filter(value, subset);
            continue;
          }
        }
        filtered[key] = value;
      }
      return filtered;
    })(actual, expected),
    expected
  );
}
export function fail(msg) {
  assert(false, `Failed assertion${msg ? `: ${msg}` : '.'}`);
}
export function assertThrows(fn, ErrorClass, msgIncludes = '', msg) {
  let doesThrow = false;
  let error = null;
  try {
    fn();
  } catch (e) {
    if (e instanceof Error === false) {
      throw new AssertionError('A non-Error object was thrown.');
    }
    if (ErrorClass && !(e instanceof ErrorClass)) {
      msg = `Expected error to be instance of "${ErrorClass.name}", but was "${
        e.constructor.name
      }"${msg ? `: ${msg}` : '.'}`;
      throw new AssertionError(msg);
    }
    if (
      msgIncludes &&
      !stripColor(e.message).includes(stripColor(msgIncludes))
    ) {
      msg = `Expected error message to include "${msgIncludes}", but got "${
        e.message
      }"${msg ? `: ${msg}` : '.'}`;
      throw new AssertionError(msg);
    }
    doesThrow = true;
    error = e;
  }
  if (!doesThrow) {
    msg = `Expected function to throw${msg ? `: ${msg}` : '.'}`;
    throw new AssertionError(msg);
  }
  return error;
}
export async function assertThrowsAsync(fn, ErrorClass, msgIncludes = '', msg) {
  let doesThrow = false;
  let error = null;
  try {
    await fn();
  } catch (e) {
    if (e instanceof Error === false) {
      throw new AssertionError('A non-Error object was thrown or rejected.');
    }
    if (ErrorClass && !(e instanceof ErrorClass)) {
      msg = `Expected error to be instance of "${ErrorClass.name}", but got "${
        e.name
      }"${msg ? `: ${msg}` : '.'}`;
      throw new AssertionError(msg);
    }
    if (
      msgIncludes &&
      !stripColor(e.message).includes(stripColor(msgIncludes))
    ) {
      msg = `Expected error message to include "${msgIncludes}", but got "${
        e.message
      }"${msg ? `: ${msg}` : '.'}`;
      throw new AssertionError(msg);
    }
    doesThrow = true;
    error = e;
  }
  if (!doesThrow) {
    msg = `Expected function to throw${msg ? `: ${msg}` : '.'}`;
    throw new AssertionError(msg);
  }
  return error;
}
export function unimplemented(msg) {
  throw new AssertionError(msg || 'unimplemented');
}
export function unreachable() {
  throw new AssertionError('unreachable');
}
