import { ObservableAsync, AsyncProducerWithoutArgs } from "@corets/async"

export type UseAffect = <TResult extends () => any | Promise<any>>(
  producer: ObservableAsync<TResult> | AsyncProducerWithoutArgs<TResult>,
  dependencies?: any[]
) => ObservableAsync<TResult>
