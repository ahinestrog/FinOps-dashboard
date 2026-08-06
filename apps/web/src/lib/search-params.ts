import { parseAsBoolean, parseAsNumberLiteral, parseAsString, parseAsStringLiteral } from 'nuqs'

/**
 * Estado de pantalla en la URL: las vistas son compartibles y el back del
 * navegador funciona. Tema y sidebar viven en localStorage, no aquí.
 */
export const groupParser = parseAsStringLiteral(['service', 'account', 'region', 'tag'] as const)
  .withDefault('service')
  .withOptions({ clearOnDefault: true })

export const advisorCategoryParser = parseAsStringLiteral([
  'cost',
  'perf',
  'sec',
  'ft',
  'lim',
] as const)
  .withDefault('cost')
  .withOptions({ clearOnDefault: true })

export const serviceParser = parseAsStringLiteral([
  'ec2',
  'rds',
  's3',
  'eks',
  'lambda',
  'ebs',
] as const)
  .withDefault('ec2')
  .withOptions({ clearOnDefault: true })

export const windowParser = parseAsNumberLiteral([14, 30, 90] as const)
  .withDefault(14)
  .withOptions({ clearOnDefault: true })

export const queryParser = parseAsString.withDefault('').withOptions({ clearOnDefault: true })

export const boolFilterParser = parseAsBoolean.withDefault(false).withOptions({
  clearOnDefault: true,
})
