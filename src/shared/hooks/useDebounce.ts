import { useState } from 'react'
import { debounce } from 'lodash'

interface IDebounce {
  debounceWait: (exec: () => void) => void
}

const useDebounce = (): IDebounce => {
  const [run, setRun] = useState<any>()

  const debounceWait = (exec: () => void): void => {
    if (run) {
      run.current.cancel()
    }

    const debounced = debounce(() => {
      exec()
    }, 500)

    debounced()

    setRun({ current: debounced })
  }

  return { debounceWait }
}

export default useDebounce
