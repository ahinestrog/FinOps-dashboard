# Datos mock — LedgerOps

Fixtures listos para portar. Cifras coherentes entre sí: el total de servicios y el de
cuentas suman lo mismo, y el ahorro de las recomendaciones cuadra con los $63,480/mes.

## Organización

- Acme Corp · `o-9f3k` · 14 cuentas · 6 regiones
- Usuario: Marta Cordero, FinOps Lead
- Periodo del prototipo: 1 – 31 agosto 2026

## Serie mensual de gasto (12 meses, miles de USD)

```
Sep 402 · Oct 418 · Nov 431 · Dic 455 · Ene 441 · Feb 462
Mar 470 · Abr 478 · May 466 · Jun 489 · Jul 495 · Ago 487
```

Budget de la organización: $500k/mes. Forecast agosto: $512.4k.

## Gasto por servicio (MTD)

| Servicio | Gasto | Δ |
|---|---|---|
| Amazon EC2 | $187,400 | +3.1% |
| Amazon S3 | $62,100 | −1.4% |
| Amazon RDS | $54,800 | +0.8% |
| Amazon EKS | $41,900 | +11.2% |
| AWS Lambda | $31,200 | +2.0% |
| CloudFront | $24,600 | −3.6% |
| DynamoDB | $19,300 | +1.1% |

## Gasto por cuenta (MTD)

| Cuenta | Gasto | Δ |
|---|---|---|
| prod-core (4471…8820) | $214,800 | +2.4% |
| data-platform (9932…1104) | $96,400 | +14.6% |
| prod-eu (2210…7745) | $71,200 | +1.2% |
| staging (8814…3390) | $43,600 | −6.8% |
| shared-services (5567…2201) | $30,200 | +0.4% |
| sandbox (1180…9934) | $18,900 | +22.1% |
| security-tooling (7745…0012) | $12,100 | −0.9% |

## Gasto por región (MTD)

| Región | Gasto | Δ |
|---|---|---|
| us-east-1 | $226,300 | +2.9% |
| eu-west-1 | $104,700 | +1.6% |
| us-west-2 | $68,400 | +5.4% |
| eu-central-1 | $41,200 | −2.1% |
| ap-southeast-1 | $28,600 | +8.8% |
| sa-east-1 | $12,300 | +0.6% |
| global (CloudFront/R53) | $5,820 | −1.1% |

## Gasto por tag Team (MTD)

| Tag | Gasto | Δ |
|---|---|---|
| Team: platform | $168,900 | +2.2% |
| Team: data | $112,400 | +13.9% |
| Team: payments | $74,600 | +0.7% |
| Team: growth | $48,300 | −4.2% |
| Team: ml-research | $39,800 | +18.4% |
| Team: corp-it | $21,100 | +1.0% |
| Sin tag | $22,200 | +6.1% |

Cobertura SP/RI por fila (en orden): 72, 61, 68, 44, 55, 12, 39 (%).
Forecast por fila: gasto × 1.052.

## Eventos CloudTrail

Campos: hora UTC · eventName · eventSource · identidad · cuenta · región · IP · resultado ·
esEscritura · impactoEnCoste

```
11:04:12  RunInstances          ec2               role/deploy-platform   prod-core        us-east-1     52.14.88.201   Success       W  $
11:02:47  CreateBucket          s3                user/j.ferrer          data-platform    eu-west-1     81.44.19.77    Success       W  $
10:58:03  ModifyDBInstance      rds               role/dba-oncall        prod-core        us-east-1     52.14.88.14    Success       W  $
10:55:31  DeleteSnapshot        ec2               role/cleanup-lambda    staging          us-west-2     10.24.7.19     Success       W  $
10:52:18  AssumeRole            sts               user/m.cordero         shared-services  us-east-1     81.44.19.12    Success       .  .
10:49:56  CreateCluster         eks               role/data-pipeline     data-platform    eu-west-1     34.240.11.8    Success       W  $
10:47:22  PutBucketPolicy       s3                user/l.navarro         prod-eu          eu-central-1  81.44.19.90    AccessDenied  W  .
10:44:09  DescribeInstances     ec2               role/finops-reader     prod-core        us-east-1     52.14.88.33    Success       .  .
10:41:37  PurchaseSavingsPlan   savingsplans      user/m.cordero         shared-services  us-east-1     81.44.19.12    Success       W  $
10:38:14  TerminateInstances    ec2               role/asg-scaler        prod-core        us-west-2     10.11.4.2      Success       W  $
10:35:50  CreateFunction        lambda            role/deploy-payments   prod-core        us-east-1     52.14.88.77    Success       W  $
10:33:02  DeleteBucket          s3                user/r.pons            sandbox          us-east-1     81.44.19.61    AccessDenied  W  .
10:30:41  ConsoleLogin          signin            root                   prod-core        us-east-1     203.0.113.44   Failure       .  .
10:27:19  StartDBCluster        rds               role/data-pipeline     data-platform    eu-west-1     34.240.11.19   Success       W  $
10:24:05  GetCostAndUsage       ce                role/finops-reader     shared-services  us-east-1     52.14.88.33    Success       .  .
```

KPIs: 128,443 eventos en 24 h · 312 AccessDenied · 47 identidades activas · 26 con impacto en coste.

## Trusted Advisor

| Categoría | error | warn | ok |
|---|---|---|---|
| Cost Optimization | 3 | 12 | 24 |
| Performance | 1 | 7 | 19 |
| Security | 4 | 9 | 31 |
| Fault Tolerance | 2 | 11 | 22 |
| Service Limits | 0 | 5 | 40 |

**Cost Optimization**
- 🔴 Low-utilization Amazon EC2 instances — CPU media < 10% durante 14 días — 6 cuentas · 184 recursos · $21,400/mes
- 🔴 Idle load balancers — ALB/NLB sin requests en 7 días — 4 cuentas · 31 · $3,720/mes
- 🟡 Unassociated Elastic IP addresses — EIP reservadas sin instancia — 5 cuentas · 58 · $1,160/mes
- 🟡 Underutilized Amazon EBS volumes — gp2 con IOPS < 5% — 7 cuentas · 412 · $8,940/mes
- 🟡 Savings Plans coverage — cobertura de compute por debajo del objetivo — 3 cuentas · $18,300/mes
- 🟢 Amazon RDS idle DB instances — sin conexiones en 7 días — 2 cuentas · 0

**Performance**
- 🔴 Overutilized Amazon EBS magnetic volumes — 2 cuentas · 14
- 🟡 High utilization EC2 instances — CPU > 90% durante 4 días — 3 cuentas · 22
- 🟡 CloudFront cache hit ratio — por debajo del 80% — 2 cuentas · 6 · $1,940/mes
- 🟢 Large number of security group rules — 14 cuentas · 0

**Security**
- 🔴 S3 bucket permissions — buckets con acceso público de lectura — 3 cuentas · 7
- 🔴 MFA on root account — root sin MFA — 2 cuentas · 2
- 🟡 IAM access key rotation — claves con más de 90 días — 8 cuentas · 46
- 🟡 Security groups — unrestricted access — 0.0.0.0/0 en puertos sensibles — 5 cuentas · 19
- 🟢 CloudTrail logging — trail multi-región activo — 14 cuentas · 0

**Fault Tolerance**
- 🔴 Amazon RDS Multi-AZ — instancias productivas single-AZ — 2 cuentas · 9
- 🟡 EBS snapshots — volúmenes sin snapshot en 30 días — 6 cuentas · 87
- 🟡 Auto Scaling group health check — health check EC2 en lugar de ELB — 4 cuentas · 12
- 🟢 Amazon S3 versioning — 11 cuentas · 0

**Service Limits**
- 🟡 VPC Elastic IP limit — uso > 80% del límite — 3 cuentas · 3
- 🟡 EC2 On-Demand vCPU limit — us-east-1 al 86% — 1 cuenta · 1
- 🟢 RDS DB instances — uso al 42% del límite — 14 cuentas · 0

## Top recursos

Campos por fila: id · nombre · tipo · cuenta·región · métrica · valor numérico · coste/mes ·
Δ · etiqueta descriptiva · explicación · acción propuesta · ahorro de la acción.

### EC2 — 1,284 recursos · $187,400 (38.5%) · desperdicio $29,800 en 184 recursos · top 10 = $61,900 (33%)

| id | nombre | tipo | cuenta · región | CPU | $/mes | Δ | acción | ahorro |
|---|---|---|---|---|---|---|---|---|
| i-0a3f19c74b2e8d551 | eks-data-ingest-node-01 | m6i.8xlarge | data-platform · eu-west-1 | 78% | 11,840 | +142% | Reducir node group a 12 nodos | 4,200 |
| i-04c81ba9de7712f30 | payments-api-prod-03 | m5.4xlarge | prod-core · us-east-1 | 54% | 9,210 | +3.1% | m5.4xlarge → m6g.4xlarge | 1,980 |
| i-07bb2f5c1099ae431 | ml-training-gpu-02 | g5.12xlarge | sandbox · us-east-1 | 9% | 8,640 | +22.1% | Scheduler de apagado 20:00–07:00 | 5,900 |
| i-0dd41c8827fa3b019 | batch-etl-worker-11 | r6i.4xlarge | data-platform · eu-west-1 | 31% | 6,420 | +8.4% | r6i.4xlarge → r6g.2xlarge | 2,410 |
| i-0f92ab3e5510cc784 | legacy-monolith-web-01 | m4.10xlarge | prod-core · us-east-1 | 22% | 5,980 | — | m4.10xlarge → m6i.4xlarge | 3,120 |
| i-0b7719ce4d8a02f61 | search-index-prod-04 | c6i.4xlarge | prod-eu · eu-central-1 | 67% | 4,890 | +1.2% | Ampliar cobertura Savings Plan | 780 |
| i-02ce8d1ab4470f993 | jenkins-builder-05 | c5.9xlarge | shared-services · us-east-1 | 13% | 4,120 | −4.6% | Migrar a fleet spot autoscalado | 2,740 |
| i-091ab4fe27c30d5b8 | staging-app-cluster-02 | m5.2xlarge | staging · us-west-2 | 8% | 3,760 | −6.8% | Apagado automático fuera de sprint | 2,900 |
| i-05ffb2210cc84a37d | redis-proxy-prod-01 | r5.2xlarge | prod-core · us-east-1 | 49% | 3,210 | +0.8% | r5.2xlarge → r6g.2xlarge | 690 |
| i-08a1c0d3ff5b71e40 | video-transcode-worker-07 | c6a.8xlarge | prod-eu · eu-west-1 | 41% | 2,980 | +5.4% | On-Demand → Spot (70% mix) | 1,610 |

### RDS — 96 recursos · $54,800 (11.3%) · desperdicio $9,140 en 21 · top 10 = $31,200 (57%)
Métrica: conexiones vs. límite.

| id | nombre | clase | cuenta · región | métrica | $/mes | Δ | acción | ahorro |
|---|---|---|---|---|---|---|---|---|
| payments-primary | Aurora PostgreSQL · writer | db.r6g.8xlarge | prod-core · us-east-1 | 72% | 9,840 | +2.2% | Renovar RI (vence en 41 días) | 1,240 |
| analytics-warehouse | Aurora PostgreSQL · reader | db.r6i.4xlarge | data-platform · eu-west-1 | 38% | 7,120 | +14.6% | Migrar a Aurora Serverless v2 | 3,180 |
| orders-legacy | MySQL 5.7 · single-AZ | db.m5.4xlarge | prod-core · us-east-1 | 19% | 5,460 | — | db.m5.4xlarge → db.m6g.2xlarge | 2,100 |
| reporting-replica-02 | PostgreSQL · read replica | db.r5.2xlarge | prod-eu · eu-central-1 | 6% | 3,980 | −1.1% | Eliminar réplica | 3,980 |
| sessions-cache-db | MySQL 8.0 | db.t3.2xlarge | staging · us-west-2 | 11% | 1,420 | −3.4% | Snapshot y parada programada | 1,420 |

### S3 — 412 buckets · $62,100 (12.8%) · desperdicio $11,900 en 74 · top 10 = $38,400 (62%)
Métrica: accesos en 90 días.

| bucket | uso | clase | cuenta · región | accesos | $/mes | Δ | acción | ahorro |
|---|---|---|---|---|---|---|---|---|
| acme-datalake-raw | Data lake · zona raw | Standard · 214 TB | data-platform · eu-west-1 | 4% | 14,820 | +9.1% | Standard → Intelligent-Tiering | 5,940 |
| acme-clickstream-events | Eventos de producto | Standard · 88 TB | data-platform · us-east-1 | 31% | 8,940 | +4.2% | Lifecycle a Glacier IR (>90 d) | 2,610 |
| acme-backups-prod | Backups aplicativos | Standard-IA · 61 TB | prod-core · us-east-1 | 12% | 5,210 | +0.7% | Expirar versiones no actuales (>180 d) | 1,040 |
| acme-cloudtrail-archive | Logs de auditoría | Standard · 34 TB | security-tooling · us-east-1 | 1% | 3,860 | +1.4% | Lifecycle a Deep Archive (>30 d) | 3,480 |
| acme-static-assets-eu | Assets web con CloudFront | Standard · 9 TB | prod-eu · eu-central-1 | 88% | 2,140 | −2.1% | Sin acción | 0 |

### EKS — 22 clústeres · $41,900 (8.6%) · desperdicio $8,300 en 9 · top 10 = $28,600 (68%)
Métrica: request vs. uso real.

| clúster | node group | tipo | cuenta · región | métrica | $/mes | Δ | acción | ahorro |
|---|---|---|---|---|---|---|---|---|
| data-ingest-prod | ingesta · 40 nodos | m6i.8xlarge | data-platform · eu-west-1 | 81% | 16,400 | +142% | Reducir a 12 nodos | 4,200 |
| payments-prod | API · 18 nodos | c6i.4xlarge | prod-core · us-east-1 | 58% | 9,210 | +2.4% | Consolidar con Karpenter | 2,210 |
| ml-platform | GPU · 6 nodos | g5.4xlarge | data-platform · us-east-1 | 24% | 7,480 | +18.4% | Time-sharing de GPU + escalado a 0 | 3,120 |
| internal-tools | general · 9 nodos | m6g.2xlarge | shared-services · us-east-1 | 62% | 4,120 | +0.9% | Sin acción | 0 |
| staging-cluster | staging · 12 nodos | m5.2xlarge | staging · us-west-2 | 14% | 3,680 | −6.8% | Cluster autoscaler mín. 2 nodos | 2,480 |

### Lambda — 1,840 funciones · $31,200 (6.4%) · desperdicio $4,600 en 128 · top 10 = $18,900 (61%)
Métrica: memoria usada / asignada.

| función | uso | memoria | cuenta · región | métrica | $/mes | Δ | acción | ahorro |
|---|---|---|---|---|---|---|---|---|
| events-fanout-processor | Procesador de eventos | 3008 MB | prod-core · us-east-1 | 34% | 8,940 | +6.2% | 3008 MB → 1024 MB | 3,020 |
| image-resize-api | Transformación de imágenes | 2048 MB | prod-eu · eu-west-1 | 78% | 5,210 | +2.0% | Sin acción | 0 |
| nightly-report-builder | Informes nocturnos | 1536 MB | shared-services · us-east-1 | 41% | 2,840 | +1.1% | x86 → arm64 (Graviton) | 560 |
| auth-token-validator | Validación de tokens | 512 MB | prod-core · us-east-1 | 86% | 1,920 | +0.4% | Sin acción | 0 |
| legacy-cron-sync | Sincronización legacy | 1024 MB | sandbox · us-east-1 | 7% | 640 | — | Deshabilitar regla EventBridge | 640 |

### EBS — 3,120 volúmenes · $18,600 (3.8%) · desperdicio $8,940 en 412 · top 10 = $7,400 (40%)
Métrica: IOPS usadas / provisionadas.

| id | nombre | tipo | cuenta · región | métrica | $/mes | Δ | acción | ahorro |
|---|---|---|---|---|---|---|---|---|
| vol-0c41ff8b2e7719a03 | data-lake-scratch | gp2 · 16 TB | data-platform · eu-west-1 | 3% | 2,140 | +1.8% | gp2 → gp3 | 430 |
| vol-07a9d3c5510bb2f81 | db-backup-staging | io1 · 4 TB · 20k IOPS | staging · us-west-2 | 5% | 1,980 | — | io1 → gp3 con 6k IOPS | 1,490 |
| vol-0b12ee7743a9cd560 | ml-datasets-cache | gp3 · 8 TB | data-platform · us-east-1 | 62% | 1,210 | +3.2% | Sin acción | 0 |
| vol-091cc8ab4470ff32d | orphan-legacy-web-01 | gp2 · 2 TB | prod-core · us-east-1 | 0% | 860 | — | Snapshot y eliminar volumen | 860 |
| vol-05de210ccff84a3b7 | jenkins-workspace | gp2 · 1.5 TB | shared-services · us-east-1 | 9% | 640 | −1.2% | gp2 → gp3 | 180 |

## Optimización

Ahorro anualizado $761,760 · mensual $63,480 · 18 recomendaciones abiertas.

Fuentes: Compute Optimizer $22,160 · Savings Plans $16,900 · Recursos ociosos $16,940 ·
Almacenamiento $7,480.

Cobertura: Compute SP 61% (objetivo 85%) · RDS RI 78% (objetivo 75%) ·
ElastiCache RI 44% (objetivo 70%).

| Fuente | Título | Ahorro | Esfuerzo | Cuenta |
|---|---|---|---|---|
| Compute Optimizer | Rightsizing de 62 instancias m5 → m6g | $18,240/mes | Medio | prod-core |
| Savings Plans | Compute Savings Plan a 1 año | $16,900/mes | Bajo | shared-services |
| Idle Resources | Apagar 184 instancias con CPU < 10% | $11,320/mes | Bajo | 6 cuentas |
| Storage | Ciclo de vida S3 a Intelligent-Tiering | $7,480/mes | Bajo | data-platform |
| Trusted Advisor | Eliminar 31 load balancers ociosos | $5,620/mes | Bajo | staging |
| Compute Optimizer | Reducir 412 volúmenes EBS gp2 → gp3 | $3,920/mes | Medio | 7 cuentas |

Descripciones largas y planes de ejecución: ver `recsData()` en el archivo de referencia.

## Alertas

| Anomalía | Severidad | Contexto | Causa probable | Impacto |
|---|---|---|---|---|
| Pico de gasto en Amazon EKS | Crítica | data-platform · eu-west-1 · hace 6 h | Nuevo node group m6i.8xlarge escalado a 40 nodos por el pipeline de ingesta | +$5,840/día |
| Transferencia de datos NAT Gateway | Crítica | prod-core · us-east-1 · hace 14 h | Tráfico inter-AZ sin VPC endpoint para S3 desde el clúster de payments | +$3,300/día |
| Sandbox por encima de lo habitual | Media | sandbox · us-east-1 · hace 2 d | Instancias GPU g5.12xlarge encendidas fuera de horario laboral | +$980/día |

Sparklines (9 puntos): EKS `8,10,9,11,12,14,26,38,41` · NAT `12,13,12,14,18,22,25,31,34` ·
Sandbox `4,5,4,6,7,9,8,11,12`.

Acciones sugeridas del modal: reducir node group a 12 nodos ($4,200/día) · añadir VPC endpoint
para S3 ($3,100/día) · scheduler de apagado 20:00–07:00 ($780/día).

### Budgets

| Budget | Gastado | Límite | Estado |
|---|---|---|---|
| Organización · mensual | $487.3k | $500k | 97% consumido · forecast 102% |
| prod-core | $214.8k | $240k | 89% consumido |
| data-platform | $96.4k | $85k | **Excedido en $11.4k** |
| sandbox | $18.9k | $40k | 47% consumido |

## Dashboard — compromisos y KPIs

Compromisos: Cobertura Compute SP 61% · Utilización SP 96% · Utilización RI 88% ·
Gasto en Spot 12%.

## FinOps Agent — preguntas de ejemplo

- ¿Por qué subió el gasto de EKS en data-platform esta semana?
- Dame las 5 acciones con mayor ahorro y menor riesgo para este trimestre
- ¿Qué cambios de CloudTrail explican el pico del martes en us-east-1?
- Simula el impacto de un Compute Savings Plan de 1 año al 85% de cobertura
