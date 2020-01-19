# access-counter

_Count access to your data's properties at runtime._

## What

This library uses [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to count object and array property lookups in a data object that's from `JSON.parse`

## Why

You might use this to determine fields in an API's response that are totally unused by your web client.

## How

Add access-counter to your API fetching method under a development flag:

```js
import accessCounter from 'access-counter'

if (__DEV__) {
  // Track access-counter's records
  window._accessCounter = new Map()
}

const fetchSomeData = async (endpoint) => {
  const response = await fetch(`http://localhost:3000/api${endpoint}`)

  if (!response.ok) {
    throw new Error(
      `Response failed with status ${response.status}: ${response.statusText}`
    )
  }

  let data = await response.json()

  if (__DEV__) {
    let [data, getAccess] = accessCounter(data)

    window._accessCounter.set(
      {
        endpoint,
        timestamp: Date.now()
      },
      getAccess
    )
  }

  return data
}
```

You can then see data use with `window._accessCounter`:

```js
console.table(
  Array.from(window._accessCounter.entries()).map(
    ([{ endpoint, timestamp }, getAccess]) => ({
      endpoint,
      timestamp,
      length: JSON.stringify(getAccess()).length
    })
  )
)
```

## When

Now.

## Who

The [@swashcap](https://github.com/swashcap).

## License

Apache-2.0. See [LICENSE](./LICENSE).
