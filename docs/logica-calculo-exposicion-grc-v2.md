# Lógica de Cálculo de Exposición GRC (Versión 2.0 Corregida)

## 1. Objetivo
Calcular una exposición económica indicativa y realista ajustada al perfil de la empresa (Empresa Estándar, Prestador de Servicios Esenciales - PSE, u Operador de Importancia Vital - OIV) y a la tipología de la falta (Leve, Grave, Gravísima), corrigiendo las sobreestimaciones de aplicar techos sancionatorios máximos absolutos por defecto.

---

## 2. Techos Sancionatorios Legales Reales (Leyes Chilenas en UTM)

### A. Ley N° 21.663 (Marco de Ciberseguridad - ANCI)
* **Prestadores de Servicios Esenciales (PSE Estándar)**:
  * **Infracción Leve**: Hasta 5.000 UTM
  * **Infracción Grave**: Hasta 10.000 UTM
  * **Infracción Gravísima**: Hasta 20.000 UTM (Máximo legal estándar)
* **Operadores de Importancia Vital (OIV)** (*Sujeto a resolución exenta fundada de la ANCI*):
  * **Infracción Leve**: Hasta 10.000 UTM
  * **Infracción Grave**: Hasta 20.000 UTM
  * **Infracción Gravísima**: Hasta 40.000 UTM (Máximo agravado)

### B. Ley N° 21.719 (Protección de Datos Personales - APDP)
* **Infracción Leve**: Hasta 5.000 UTM (Nota: La Ley 19.628 modificada fija tramos graduales de hasta 5.000 UTM para faltas leves)
* **Infracción Grave**: Hasta 10.000 UTM
* **Infracción Gravísima**: Hasta 20.000 UTM (Máximo ordinario)
* **Reincidencia (Faltas Graves/Gravísimas)**: Hasta 60.000 UTM o entre el 2% y 4% de los ingresos anuales de la empresa en Chile. (*Nota: La reincidencia exige sanción previa firme; no aplica a un diagnóstico inicial*).

---

## 3. Determinación de la Base de Cálculo por Perfil de Empresa

| Perfil de Empresa | Techo Ley 21.663 | Techo Ley 21.719 (Sin Reincidencia) | Techo Teórico Combinado (Gravísimo) |
| :--- | :--- | :--- | :--- |
| **Empresa Privada Estándar (No PSE / No OIV)** | 0 UTM (No aplica) | 20.000 UTM | **20.000 UTM** |
| **Prestador de Servicios Esenciales (PSE)** | 20.000 UTM | 20.000 UTM | **40.000 UTM** |
| **Operador de Importancia Vital (OIV)** | 40.000 UTM | 20.000 UTM | **60.000 UTM** |

---

## 4. Fórmula de Cálculo Ajustada por Madurez y Tipología de Infracción

### A. Factor de Riesgo por Madurez
$$\text{factorRiesgo} = 1 - \left(\frac{\text{scoreMadurez}}{100}\right) \times 0.9$$

* **Score 100 (Madurez Máxima)** $\rightarrow \text{factorRiesgo} = \mathbf{0.1}$ (Reducción del 90% de la exposición por presencia de controles y atenuantes como el Modelo de Prevención Decreto 662/2025).
* **Score 50 (Madurez Media)** $\rightarrow \text{factorRiesgo} = \mathbf{0.55}$
* **Score 0 (Sin Madurez)** $\rightarrow \text{factorRiesgo} = \mathbf{1.0}$

### B. Ponderación por Escenarios de Infracción (Percentiles P10, P50, P90)
En lugar de aplicar porcentajes arbitrarios sobre el valor gravísimo máximo, el cálculo segmenta el impacto según la base sancionatoria de cada nivel de falta:

1. **Escenario Leve (Percentil P10)**:
   $$\text{P10} = \text{BaseLeve} \times 0.05 \times \text{factorRiesgo}$$
2. **Escenario Grave (Percentil P50)**:
   $$\text{P50} = \text{BaseGrave} \times 0.10 \times \text{factorRiesgo}$$
3. **Escenario Gravísimo (Percentil P90)**:
   $$\text{P90} = \text{BaseGravísima} \times 0.20 \times \text{factorRiesgo}$$

---

## 5. Ejemplos de Simulación Comparativa

### Ejemplo 1: Corredora de Seguros / Empresa PSE (Score de Madurez = 80, Techo Ponderado = 40.000 UTM)
* **factorRiesgo**: $1 - (80/100) \times 0.9 = \mathbf{0.28}$
* **P10 (Escenario Leve - Base 5.000 UTM)**: $5.000 \times 0.05 \times 0.28 = \mathbf{70\text{ UTM}}$ (~$4.7M CLP)
* **P50 (Escenario Grave - Base 10.000 UTM)**: $10.000 \times 0.10 \times 0.28 = \mathbf{280\text{ UTM}}$ (~$18.8M CLP)
* **P90 (Escenario Gravísimo - Base 40.000 UTM)**: $40.000 \times 0.20 \times 0.28 = \mathbf{2.240\text{ UTM}}$ (~$150M CLP)

### Ejemplo 2: PYME / Empresa Privada Regular (Score de Madurez = 40, Techo Ponderado = 20.000 UTM)
* **factorRiesgo**: $1 - (40/100) \times 0.9 = \mathbf{0.64}$
* **P10 (Escenario Leve - Base 5.000 UTM)**: $5.000 \times 0.05 \times 0.64 = \mathbf{160\text{ UTM}}$ (~$10.7M CLP)
* **P50 (Escenario Grave - Base 10.000 UTM)**: $10.000 \times 0.10 \times 0.64 = \mathbf{640\text{ UTM}}$ (~$42.9M CLP)
* **P90 (Escenario Gravísimo - Base 20.000 UTM)**: $20.000 \times 0.20 \times 0.64 = \mathbf{2.560\text{ UTM}}$ (~$171.5M CLP)

---

## 6. Parametrización Dinámica en Código (TypeScript)

```typescript
export interface ParametrosCalculoGRC {
  scoreMadurez: number; // 0 - 100
  esPSE: boolean;
  esOIV: boolean;
  valorUTMCLP: number; // Ej: 67000
}

export interface ResultadoExposicionGRC {
  factorRiesgo: number;
  techoMaximoUTM: number;
  p10_UTM: number;
  p10_CLP: number;
  p50_UTM: number;
  p50_CLP: number;
  p90_UTM: number;
  p90_CLP: number;
}

export function calcularExposicionGRC(params: ParametrosCalculoGRC): ResultadoExposicionGRC {
  const { scoreMadurez, esPSE, esOIV, valorUTMCLP } = params;

  // 1. Determinar Techo Ciberseguridad (Ley 21.663)
  let techoCiberUTM = 0;
  let baseLeveCiber = 0;
  let baseGraveCiber = 0;

  if (esOIV) {
    techoCiberUTM = 40000;
    baseLeveCiber = 10000;
    baseGraveCiber = 20000;
  } else if (esPSE) {
    techoCiberUTM = 20000;
    baseLeveCiber = 5000;
    baseGraveCiber = 10000;
  }

  // 2. Determinar Techo Datos Personales (Ley 21.719)
  const techoDatosUTM = 20000; // Máximo ordinario
  const baseLeveDatos = 5000;
  const baseGraveDatos = 10000;

  // 3. Totales por categoría
  const baseLeveTotal = baseLeveCiber + baseLeveDatos;
  const baseGraveTotal = baseGraveCiber + baseGraveDatos;
  const techoGravissimoTotal = techoCiberUTM + techoDatosUTM;

  // 4. Factor de Riesgo por Madurez
  const factorRiesgo = 1 - (Math.min(100, Math.max(0, scoreMadurez)) / 100) * 0.9;

  // 5. Percentiles P10, P50, P90
  const p10_UTM = Math.round(baseLeveTotal * 0.05 * factorRiesgo);
  const p50_UTM = Math.round(baseGraveTotal * 0.10 * factorRiesgo);
  const p90_UTM = Math.round(techoGravissimoTotal * 0.20 * factorRiesgo);

  return {
    factorRiesgo,
    techoMaximoUTM: techoGravissimoTotal,
    p10_UTM,
    p10_CLP: p10_UTM * valorUTMCLP,
    p50_UTM,
    p50_CLP: p50_UTM * valorUTMCLP,
    p90_UTM,
    p90_CLP: p90_UTM * valorUTMCLP,
  };
}
```
