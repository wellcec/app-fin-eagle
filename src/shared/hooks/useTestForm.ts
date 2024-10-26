import { MAIOR_QUE_ZERO } from '~/constants/messages'
import useUtils from './useUtils'

interface ITestsForm {
  greaterThanZero: any
  greaterThanZeroCurrency: any
}

const useTestsForm = (): ITestsForm => {
  const { formatNumber } = useUtils()

  const greaterThanZero = {
    test: (v: number) => (v ?? 0) > 0,
    message: MAIOR_QUE_ZERO
  }

  const greaterThanZeroCurrency = {
    test: (v: string) => formatNumber(v ?? 0, 'float') > 0,
    message: MAIOR_QUE_ZERO
  }

  return { greaterThanZero, greaterThanZeroCurrency }
}

export default useTestsForm
