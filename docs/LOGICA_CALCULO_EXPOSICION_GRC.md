# Lógica de Cálculo de Exposición GRC

## Objetivo

Calcular una **exposición económica indicativa** basada en:
1. **Techos sancionatorios reales** de las leyes chilenas (en UTM)
2. **Score de madurez** del cuestionario (0-100)
3. **Aplicabilidad** de Ley 21.663 y Ley 21.719

## Techos Sancionatorios Legales

### Ley 21.663 (Ciberseguridad)
- **Leve**: 0 - 5,000 UTM
- **Grave**: 5,001 - 20,000 UTM
- **Gravísima**: 20,001 - **40,000 UTM** (máximo)

### Ley 21.719 (Datos Personales)
- **Leve**: 0 - 2,000 UTM
- **Grave**: 2,001 - 10,000 UTM
- **Gravísima**: 10,001 - **20,000 UTM** (máximo)

### Multa Máxima Teórica
Si ambas leyes aplican: **60,000 UTM** (~$4,020,000,000 CLP)

---

## Fórmula de Cálculo

### 1. Factor de Riesgo (basado en madurez)

```typescript
factorRiesgo = 1 - (scoreMadurez / 100) * 0.9
```

**Ejemplos:**
- Score 100 (máxima madurez) → factorRiesgo = **0.1** (10% de riesgo)
- Score 80 (buena madurez) → factorRiesgo = **0.28** (28% de riesgo)
- Score 50 (madurez media) → factorRiesgo = **0.55** (55% de riesgo)
- Score 0 (sin madurez) → factorRiesgo = **1.0** (100% de riesgo)

**Lógica:** A mayor madurez, menor probabilidad de incumplimiento grave.

---

### 2. Percentiles de Exposición

Usamos porcentajes **bajos** del máximo porque:
- Las multas máximas son **raras** (casos extremos)
- La mayoría de sanciones son **leves o graves**, no gravísimas
- El score de madurez ya reduce el riesgo

```typescript
p10UTM = multaMaxUTM * 0.01 * factorRiesgo  // 1% del máximo
p50UTM = multaMaxUTM * 0.05 * factorRiesgo  // 5% del máximo
p90UTM = multaMaxUTM * 0.15 * factorRiesgo  // 15% del máximo
```

---

## Ejemplos Reales

### Caso 1: Score 80, ambas leyes aplican

**Datos:**
- Score de madurez: **80**
- Ley 21.663: **Aplica** (40,000 UTM)
- Ley 21.719: **Aplica** (20,000 UTM)
- Multa máxima teórica: **60,000 UTM**

**Cálculo:**
```
factorRiesgo = 1 - (80/100) * 0.9 = 0.28

p10 = 60,000 * 0.01 * 0.28 = 168 UTM (~$11.3M CLP)
p50 = 60,000 * 0.05 * 0.28 = 840 UTM (~$56.3M CLP)
p90 = 60,000 * 0.15 * 0.28 = 2,520 UTM (~$168.8M CLP)
```

**Resultado:** 168 - 2,520 UTM ($11M - $169M CLP)

---

### Caso 2: Score 30, solo Ley 21.719 aplica

**Datos:**
- Score de madurez: **30**
- Ley 21.663: **No aplica**
- Ley 21.719: **Aplica** (20,000 UTM)
- Multa máxima teórica: **20,000 UTM**

**Cálculo:**
```
factorRiesgo = 1 - (30/100) * 0.9 = 0.73

p10 = 20,000 * 0.01 * 0.73 = 146 UTM (~$9.8M CLP)
p50 = 20,000 * 0.05 * 0.73 = 730 UTM (~$48.9M CLP)
p90 = 20,000 * 0.15 * 0.73 = 2,190 UTM (~$146.7M CLP)
```

**Resultado:** 146 - 2,190 UTM ($9.8M - $146.7M CLP)

---

### Caso 3: Score 100, ambas leyes aplican

**Datos:**
- Score de madurez: **100**
- Ley 21.663: **Aplica** (40,000 UTM)
- Ley 21.719: **Aplica** (20,000 UTM)
- Multa máxima teórica: **60,000 UTM**

**Cálculo:**
```
factorRiesgo = 1 - (100/100) * 0.9 = 0.1

p10 = 60,000 * 0.01 * 0.1 = 60 UTM (~$4M CLP)
p50 = 60,000 * 0.05 * 0.1 = 300 UTM (~$20.1M CLP)
p90 = 60,000 * 0.15 * 0.1 = 900 UTM (~$60.3M CLP)
```

**Resultado:** 60 - 900 UTM ($4M - $60M CLP)

---

## Validación de Lógica

### ✅ Correcta:
1. **Mayor madurez = menor exposición** (score 100 → 60-900 UTM vs score 0 → 600-9,000 UTM)
2. **Usa techos legales reales**, no valores inventados
3. **Porcentajes bajos** del máximo (1%-15%), porque multas máximas son raras
4. **Muestra UTM primero** (unidad legal) y CLP como equivalente

### ⚠️ Limitaciones:
- **Indicativo, no pericial**: No considera circunstancias específicas del caso
- **Simplificado**: No modela probabilidad de detección, gravedad del incumplimiento, etc.
- **Valor UTM fijo**: Debería actualizarse mensualmente desde SII
- **No incluye costos indirectos**: Daño reputacional, interrupción operativa, etc.

---

## Conclusión

El motor ahora:
1. ✅ Usa **techos sancionatorios reales** de las leyes chilenas
2. ✅ **Mayor madurez = menor exposición** (lógica correcta)
3. ✅ Muestra **UTM** (unidad legal) + CLP (equivalente)
4. ✅ Porcentajes **realistas** (1%-15% del máximo, no 40%-100%)
5. ✅ Es **indicativo**, no pretende ser un informe pericial

**Siguiente paso:** Validar con abogado especialista en derecho digital chileno.
