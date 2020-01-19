var test = require('ava')
var accessCounter = require('.')

const getData = () => ({
  a: 'a',
  b: {
    c: 'c',
    d: null
  },
  e: [
    true,
    false,
    {
      f: 'foobar'
    },
    [9, 8, 7]
  ],
  g: {
    h: {
      i: -1,
      j: 200
    }
  },
  'k-l': null
})

test('non-objects', t => {
  t.is(accessCounter(null)[0], null)
  t.is(accessCounter('spahgetti')[0], 'spahgetti')
})

test('basic access', t => {
  const [data, getAccess] = accessCounter(getData())

  data.a
  data.e[0]
  data['k-l']

  t.deepEqual(getAccess(), {
    a: 'a',
    e: [true],
    'k-l': null
  })
})

test('empty access', t => {
  const [data, getAccess] = accessCounter(getData())

  data.m
  data.e[100]

  t.deepEqual(getAccess(), {
    e: []
  })
})

test('array access', t => {
  const [data, getAccess] = accessCounter(getData())

  data.e[2].f
  data.e[3][2]
  data.g.h.j

  t.deepEqual(getAccess(), {
    e: [
      ,
      ,
      {
        f: 'foobar'
      },
      [, , 7]
    ],
    g: {
      h: {
        j: 200
      }
    }
  })
})

test('reference access', t => {
  const [data, getAccess] = accessCounter(getData())
  const e = data.e
  const h = data.g.h

  e[1]
  h.i

  t.deepEqual(getAccess(), {
    e: [, false],
    g: {
      h: {
        i: -1
      }
    }
  })
})

test('destructured access', t => {
  const [data, getAccess] = accessCounter(getData())
  const { g: { h: { j } } } = data

  t.deepEqual(getAccess(), {
    g: {
      h: {
        j: 200
      }
    }
  })
})

test('array iteration', t => {
  const [data, getAccess] = accessCounter(getData())

  data.e.map(x => x)

  t.deepEqual(getAccess(), {
    e: [
      true,
      false,
      {},
      []
    ]
  })

  data.e[3].join(' ')

  t.deepEqual(getAccess(), {
    e: [
      true,
      false,
      {},
      [9, 8 ,7]
    ]
  })
})

test('object iteration', t => {
  const [data, getAccess] = accessCounter(getData())

  Object.keys(data.b).map(k => data.b[k])

  t.deepEqual(getAccess(), {
    b: {
      c: 'c',
      d: null
    }
  })
})

