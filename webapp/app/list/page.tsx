import { Suspense } from 'react'
import ProgressView from './ProgressView'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProgressView />
    </Suspense>
  )
}
