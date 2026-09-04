# Presentation Deck 1: Thermodynamic Foundations & Materials Property Analysis
**Speaker / Prepared by**: Student A
**Focus**: Fundamental Physics, Lattice Dynamics, Shomate Formulation & Cross-Class Comparison
**Visual Theme**: Academic Scientific Theme (Equations, crystal lattice principles, empirical tables)

---

## Slide 1: Title Slide
- **Title**: Specific Heat Capacity (Cp vs. T) of Engineering Materials
- **Subtitle**: Microscopic Physics, Shomate Modeling & Cross-Class Comparisons across 200 Materials
- **Presenter**: Student A
- **Course**: MCR202 Materials Thermodynamics

---

## Slide 2: Physics of Specific Heat Capacity
- **Microscopic Energy Storage**: Lattice vibration (phonons), electronic states, molecular rotation
- **Low Temperature Limit**: Debye T^3 law (Cp -> 0 as T -> 0 K)
- **High Temperature Limit**: Dulong-Petit classical ceiling (Cp -> 3R ~ 24.94 J/mol*K per gram-atom)
- **Empirical Reality**: Anharmonic thermal expansion produces continuous modest increase at elevated T

---

## Slide 3: The NIST Shomate Equation Formulation
- **Reduced Temperature**: t = T / 1000 (T in Kelvin)
- **Molar Formula**: Cp(t) = A + B*t + C*t^2 + D*t^3 + E/(t^2) [J/(mol*K)]
- **Gravimetric Specific Heat**: Cp_specific = (Cp_molar / MolarMass) * 1000 [J/(kg*K)]
- **Parameter Roles**: A (base offset), B/C/D (anharmonic polynomial expansion), E (quantum freezing term)

---

## Slide 4: Cross-Class Thermodynamic Comparisons
- **Metals & Alloys (Al, Cu, Fe)**: Rapidly approach Dulong-Petit value at room temperature
- **Covalent Ceramics (SiC, Al2O3, ZrO2)**: High Debye temperature; steep sustained rise across 300 - 1500 K
- **Technological Fluids & Gases (H2O, NH3)**: Very high gravimetric specific heat due to low molar mass
- **Heavy Refractories (Pb, W)**: Low gravimetric specific heat (~130 J/kg*K) due to heavy atomic weight

---

## Slide 5: Thermal Absorption & Phase Boundary Limits
- **Enthalpy Accumulation**: Delta H = integral of Cp dT from T1 to T2
- **Engineering Application**: Thermal storage capacity, thermal barrier sizing, heat exchanger design
- **Validity Windows**: Shomate coefficients are strictly bounded by [Tmin, Tmax] due to phase changes (allotropic shifts, melting)

---

## Slide 6: Conclusions
- Analyzed thermodynamic data across 200 materials in 11 classes
- Confirmed physical consistency with solid-state theories
- Established direct conversion pipeline into computational tools
