interface IUtils {
  formatFormCurrency: (valorNumerico: number) => string
  formatNumber: (value: string | number, type: 'int' | 'float') => number
  formatNumberInput: (value: string | number) => number
  formatCurrencyRequest: (value: string) => number
  formatCurrencyString: (value: number) => string
  currencyToNumber: (value: string) => number
  normalizeText: (value: string) => string
}

const useUtils = (): IUtils => {
  const formatFormCurrency = (valorNumerico: number): string => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return formatter.format(valorNumerico)
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

  const formatNumberInput = (value: string | number): number => {
    const numericValue = value.toString().replace(/\D/g, '')
    const current = numericValue === '' ? '0' : numericValue

    return parseFloat(current) / 100
  }

  const formatCurrencyRequest = (value: string): number => {
    const cleared = value.replace('R$ ', '')
    return formatNumberInput(cleared)
  }

  const formatCurrencyString = (value: number): string => {
    if (!value) {
      return 'R$ 0,00'
    }

    const rounded = Number(value.toFixed(2))
    const output = formatFormCurrency(rounded)

    return output
  }

  const currencyToNumber = (value: string): number => {
    const cleared = value.trim().replace('R$', '').replace(/\./g, '').replace(',', '.')
    return parseFloat(cleared)
  }

  const normalizeText = (value: string): string => {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
  }

  return {
    formatFormCurrency,
    formatNumber,
    formatCurrencyRequest,
    formatCurrencyString,
    formatNumberInput,
    currencyToNumber,
    normalizeText
  }
}

export default useUtils
