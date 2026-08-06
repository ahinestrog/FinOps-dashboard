import type { AdvisorCategory, AdvisorCategoryKey, Severity } from '@finops/types'

type RawCheck = readonly [
  severity: Severity,
  name: string,
  description: string,
  accounts: string,
  resources: string,
  saving: string,
]

function checks(category: AdvisorCategoryKey, rows: readonly RawCheck[]) {
  return rows.map(
    ([severity, name, description, accountsLabel, resourcesLabel, savingLabel], i) => ({
      id: `${category}-${i}`,
      category,
      severity,
      name,
      description,
      accountsLabel,
      resourcesLabel,
      savingLabel,
    }),
  )
}

export const advisorCategoriesFixture: AdvisorCategory[] = [
  {
    key: 'cost',
    name: 'Cost Optimization',
    error: 3,
    warn: 12,
    ok: 24,
    checks: checks('cost', [
      [
        'bad',
        'Low-utilization Amazon EC2 instances',
        'CPU media < 10% durante 14 días',
        '6 cuentas',
        '184',
        '$21,400/mes',
      ],
      [
        'bad',
        'Idle load balancers',
        'ALB/NLB sin requests en 7 días',
        '4 cuentas',
        '31',
        '$3,720/mes',
      ],
      [
        'warn',
        'Unassociated Elastic IP addresses',
        'EIP reservadas sin instancia',
        '5 cuentas',
        '58',
        '$1,160/mes',
      ],
      [
        'warn',
        'Underutilized Amazon EBS volumes',
        'Volúmenes gp2 con IOPS < 5%',
        '7 cuentas',
        '412',
        '$8,940/mes',
      ],
      [
        'warn',
        'Savings Plans coverage',
        'Cobertura de compute por debajo del objetivo',
        '3 cuentas',
        '—',
        '$18,300/mes',
      ],
      ['ok', 'Amazon RDS idle DB instances', 'Sin conexiones en 7 días', '2 cuentas', '0', '—'],
    ]),
  },
  {
    key: 'perf',
    name: 'Performance',
    error: 1,
    warn: 7,
    ok: 19,
    checks: checks('perf', [
      [
        'bad',
        'Overutilized Amazon EBS magnetic volumes',
        'Volúmenes magnetic saturados',
        '2 cuentas',
        '14',
        '—',
      ],
      [
        'warn',
        'High utilization EC2 instances',
        'CPU > 90% durante 4 días',
        '3 cuentas',
        '22',
        '—',
      ],
      [
        'warn',
        'CloudFront cache hit ratio',
        'Hit ratio por debajo del 80%',
        '2 cuentas',
        '6',
        '$1,940/mes',
      ],
      [
        'ok',
        'Large number of security group rules',
        'Reglas por SG dentro del límite',
        '14 cuentas',
        '0',
        '—',
      ],
    ]),
  },
  {
    key: 'sec',
    name: 'Security',
    error: 4,
    warn: 9,
    ok: 31,
    checks: checks('sec', [
      [
        'bad',
        'S3 bucket permissions',
        'Buckets con acceso público de lectura',
        '3 cuentas',
        '7',
        '—',
      ],
      ['bad', 'MFA on root account', 'Root sin MFA habilitado', '2 cuentas', '2', '—'],
      ['warn', 'IAM access key rotation', 'Claves con más de 90 días', '8 cuentas', '46', '—'],
      [
        'warn',
        'Security groups — unrestricted access',
        '0.0.0.0/0 en puertos sensibles',
        '5 cuentas',
        '19',
        '—',
      ],
      ['ok', 'CloudTrail logging', 'Trail multi-región activo', '14 cuentas', '0', '—'],
    ]),
  },
  {
    key: 'ft',
    name: 'Fault Tolerance',
    error: 2,
    warn: 11,
    ok: 22,
    checks: checks('ft', [
      ['bad', 'Amazon RDS Multi-AZ', 'Instancias productivas single-AZ', '2 cuentas', '9', '—'],
      ['warn', 'EBS snapshots', 'Volúmenes sin snapshot en 30 días', '6 cuentas', '87', '—'],
      [
        'warn',
        'Auto Scaling group health check',
        'Health check EC2 en lugar de ELB',
        '4 cuentas',
        '12',
        '—',
      ],
      [
        'ok',
        'Amazon S3 versioning',
        'Versionado activo en buckets críticos',
        '11 cuentas',
        '0',
        '—',
      ],
    ]),
  },
  {
    key: 'lim',
    name: 'Service Limits',
    error: 0,
    warn: 5,
    ok: 40,
    checks: checks('lim', [
      ['warn', 'VPC Elastic IP limit', 'Uso por encima del 80% del límite', '3 cuentas', '3', '—'],
      ['warn', 'EC2 On-Demand vCPU limit', 'us-east-1 al 86% del límite', '1 cuenta', '1', '—'],
      ['ok', 'RDS DB instances', 'Uso al 42% del límite', '14 cuentas', '0', '—'],
    ]),
  },
]

/** Recursos detectados que muestra el modal de un check. */
export const advisorCheckResourcesFixture = [
  { name: 'i-0a3f19c74b2e8d551', meta: 'prod-core · us-east-1', value: '$1,940/mes' },
  { name: 'i-07bb2f5c1099ae431', meta: 'prod-core · us-west-2', value: '$1,420/mes' },
  { name: 'i-0dd41c8827fa3b019', meta: 'data-platform · eu-west-1', value: '$1,180/mes' },
  { name: 'i-0f92ab3e5510cc784', meta: 'staging · us-east-1', value: '$860/mes' },
]
