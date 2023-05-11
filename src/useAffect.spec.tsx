import { createAsync, createAsyncState } from "@corets/async"
import { act, render, screen } from "@testing-library/react"
import React from "react"
import { useAffect } from "./useAffect"
import { createValue } from "@corets/value"
import { useValue } from "@corets/use-value"
import { createTimeout } from "@corets/promise-helpers"

describe("useAffect", () => {
  it("uses async with a sync producer instance", async () => {
    const globalExecutionCount = createValue(0)
    const globalTeardownCount = createValue(0)
    const globalAsync = createAsync(() => {
      globalExecutionCount.set(globalExecutionCount.get() + 1)

      return () => {
        globalTeardownCount.set(globalTeardownCount.get() + 1)
      }
    })
    const globalTrigger = createValue(0)

    let renders = 0

    const Test = () => {
      renders++
      const executionCount = useValue(globalExecutionCount)
      const teardownCount = useValue(globalTeardownCount)
      const trigger = useValue(globalTrigger)
      const async = useAffect(globalAsync, [trigger.get()])

      return (
        <h1>
          {JSON.stringify({
            async: async.getState(),
            execution: executionCount.get(),
            teardown: teardownCount.get(),
            trigger: globalTrigger.get(),
          })}
        </h1>
      )
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 1, teardown: 0, trigger: 0 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(6)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 2, teardown: 1, trigger: 1 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(10)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 3, teardown: 2, trigger: 2 })
    )
  })

  it("uses async with a sync producer", async () => {
    const globalExecutionCount = createValue(0)
    const globalTeardownCount = createValue(0)
    const globalTrigger = createValue(0)

    let renders = 0

    const Test = () => {
      renders++
      const executionCount = useValue(globalExecutionCount)
      const teardownCount = useValue(globalTeardownCount)
      const trigger = useValue(globalTrigger)
      const async = useAffect(() => {
        globalExecutionCount.set(globalExecutionCount.get() + 1)

        return () => {
          globalTeardownCount.set(globalTeardownCount.get() + 1)
        }
      }, [trigger.get()])

      return (
        <h1>
          {JSON.stringify({
            async: async.getState(),
            execution: executionCount.get(),
            teardown: teardownCount.get(),
            trigger: globalTrigger.get(),
          })}
        </h1>
      )
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 1, teardown: 0, trigger: 0 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(6)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 2, teardown: 1, trigger: 1 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(10)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 3, teardown: 2, trigger: 2 })
    )
  })

  it("uses async with an async producer instance", async () => {
    const globalExecutionCount = createValue(0)
    const globalTeardownCount = createValue(0)
    const globalAsync = createAsync(async () => {
      globalExecutionCount.set(globalExecutionCount.get() + 1)

      return async () => {
        globalTeardownCount.set(globalTeardownCount.get() + 1)
      }
    })
    const globalTrigger = createValue(0)

    let renders = 0

    const Test = () => {
      renders++
      const executionCount = useValue(globalExecutionCount)
      const teardownCount = useValue(globalTeardownCount)
      const trigger = useValue(globalTrigger)
      const async = useAffect(globalAsync, [trigger.get()])

      return (
        <h1>
          {JSON.stringify({
            async: async.getState(),
            execution: executionCount.get(),
            teardown: teardownCount.get(),
            trigger: globalTrigger.get(),
          })}
        </h1>
      )
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState({ isRunning: true }), execution: 1, teardown: 0, trigger: 0 })
    )

    await act(() => createTimeout(1))

    expect(renders).toBe(3)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 1, teardown: 0, trigger: 0 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(8)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 2, teardown: 1, trigger: 1 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(13)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 3, teardown: 2, trigger: 2 })
    )
  })

  it("uses async with an async producer", async () => {
    const globalExecutionCount = createValue(0)
    const globalTeardownCount = createValue(0)
    const globalTrigger = createValue(0)

    let renders = 0

    const Test = () => {
      renders++
      const executionCount = useValue(globalExecutionCount)
      const teardownCount = useValue(globalTeardownCount)
      const trigger = useValue(globalTrigger)
      const async = useAffect(async () => {
        globalExecutionCount.set(globalExecutionCount.get() + 1)

        return async () => {
          globalTeardownCount.set(globalTeardownCount.get() + 1)
        }
      }, [trigger.get()])

      return (
        <h1>
          {JSON.stringify({
            async: async.getState(),
            execution: executionCount.get(),
            teardown: teardownCount.get(),
            trigger: globalTrigger.get(),
          })}
        </h1>
      )
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState({ isRunning: true }), execution: 1, teardown: 0, trigger: 0 })
    )

    await act(() => createTimeout(1))

    expect(renders).toBe(3)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 1, teardown: 0, trigger: 0 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(8)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 2, teardown: 1, trigger: 1 })
    )

    await act(async () => {
      globalTrigger.set(globalTrigger.get() + 1)
      await createTimeout(1)
    })

    expect(renders).toBe(13)
    expect(target).toHaveTextContent(
      JSON.stringify({ async: createAsyncState(), execution: 3, teardown: 2, trigger: 2 })
    )
  })
})
