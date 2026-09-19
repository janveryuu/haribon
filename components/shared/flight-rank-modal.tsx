import React from 'react'
import { PackRankModal, PackRankModalProps } from './pack-rank-modal'

export type FlightRankModalProps = PackRankModalProps

/**
 * @deprecated Use `PackRankModal` instead. Re-exported for backwards compatibility.
 */
export function FlightRankModal(props: FlightRankModalProps) {
  return <PackRankModal {...props} />
}

export { PackRankModal }
