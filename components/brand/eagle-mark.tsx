import React from 'react'
import { FetchMark, FetchMarkProps } from './fetch-mark'

export type EagleMarkProps = FetchMarkProps

/**
 * @deprecated Use `FetchMark` instead. Re-exported for backwards compatibility.
 */
export function EagleMark(props: EagleMarkProps) {
  return <FetchMark {...props} />
}

export { FetchMark }
