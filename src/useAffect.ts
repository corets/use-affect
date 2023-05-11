import { ObservableAsync, AsyncProducerWithoutArgs, Async } from "@corets/async"
import { useState, useRef, useMemo, useEffect } from "react"
import { UseAffect } from "./types"

export const useAffect: UseAffect = <TResult extends () => void | Promise<void>>(
  producer: ObservableAsync<TResult> | AsyncProducerWithoutArgs<TResult>,
  dependencies = [] as any[]
) => {
  const [reference, setReference] = useState(0)
  const [asyncReference, setAsyncReference] = useState(0)
  const producerRef = useRef<ObservableAsync<TResult> | AsyncProducerWithoutArgs<TResult>>(producer)
  producerRef.current = producer

  useEffect(() => {
    return () => {
      setAsyncReference((reference) => reference + 1)

      if (async) {
        const unsubscribe = async.getResult()

        if (unsubscribe) {
          Promise.resolve(unsubscribe()).catch((err) => console.error(err))
        }
      }
    }
  }, [producerRef.current instanceof Async ? producerRef.current : undefined])

  const async = useMemo<ObservableAsync<TResult>>(() => {
    if (producerRef.current instanceof Async) {
      return producerRef.current
    }

    return new Async(() => (producerRef.current as AsyncProducerWithoutArgs<TResult>)())
  }, [asyncReference])

  useEffect(() => {
    return async.listen(() => setReference((previous) => previous + 1))
  }, [async])

  useEffect(() => {
    const unsubscribe = async.getResult()

    if (unsubscribe) {
      Promise.resolve(unsubscribe())
        .catch((err) => console.error(err))
        .finally(() => async.run())
    } else {
      async.run()
    }
  }, [...dependencies, async])

  return async
}
