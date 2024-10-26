interface IUtils {
  formatFormCurrency: (valorNumerico: number) => string
  formatNumber: (value: string | number, type: 'int' | 'float') => number
  formatNumberInput: (value: string | number, type: 'int' | 'float') => number
  formatCurrencyRequest: (value: string) => number
  formatCurrencyString: (value: number) => string
}

const useUtils = (): IUtils => {
  const formatFormCurrency = (valorNumerico: number): string => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return formatter.format(valorNumerico / 100)
  }

  const formatNumber = (value: string | number, type: 'int' | 'float'): number => {
    if (!value.toString().includes('.')) {
      value = value.toString() + '.00'
    }

    const numericValue = value.toString().replace(/\D/g, '')
    const current = numericValue === '' ? '0' : numericValue

    if (type === 'int') {
      return parseInt(current, 10)
    }

    return parseFloat(current)
  }

  const formatNumberInput = (value: string | number, type: 'int' | 'float'): number => {
    const numericValue = value.toString().replace(/\D/g, '')
    const current = numericValue === '' ? '0' : numericValue

    if (type === 'int') {
      return parseInt(current, 10)
    }

    return parseFloat(current)
  }

  const formatCurrencyRequest = (value: string): number => {
    const cleared = value.replace('R$ ', '')
    return formatNumberInput(cleared, 'float') / 100
  }

  const formatCurrencyString = (value: number): string => {
    if (!value) {
      return 'R$ 0,00'
    }
    return formatFormCurrency(formatNumber(value, 'float'))
  }

  return {
    formatFormCurrency, formatNumber, formatCurrencyRequest, formatCurrencyString, formatNumberInput
  }
}

export default useUtils
