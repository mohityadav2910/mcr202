# Presentation Deck 2: Computational Architecture & Interactive UI/UX Design
**Speaker / Prepared by**: Student B
**Focus**: Platform Architecture, Algorithm Vectorization, Real-Time Filtering & Standalone Deployment
**Visual Theme**: Software Engineering & Dashboard Theme (Data pipelines, component diagrams, UI screenshots)

---

## Slide 1: Title Slide
- **Title**: Engineering an Interactive Computational Platform for Thermodynamic Materials Exploration
- **Subtitle**: Dual MATLAB & HTML5 Architecture for 200 Engineering Materials
- **Presenter**: Student B
- **Course**: MCR202 Materials Thermodynamics

---

## Slide 2: Computational Architecture & Data Pipeline
- **Data Normalization**: Converted raw Excel rows into structured JSON and binary MAT formats
- **Dual Engine Implementation**:
  - Native MATLAB Desktop Engine (CpExplorer.m) with vectorized array operations
  - Client-Side Web Engine (cpEngine.js) for universal zero-install browser deployment
- **Performance**: Instantaneous evaluation across 100-point temperature grids (< 25 ms)

---

## Slide 3: UI/UX Philosophy: Normal-Person Engineering Utility
- **Aesthetic Strategy**: Designed as a clean, utilitarian laboratory tool rather than a decorated consumer product
- **Native Controls**: Standard text search, category dropdowns, multi-select checklist, and range inputs
- **Legibility & Usability**: High-contrast scientific curves, standard grid lines, clean tabular summaries

---

## Slide 4: Interactive Multi-Curve Engine & Range Protection
- **Multi-Dataset Binding**: Dynamic overlay of up to 10 materials concurrently with distinct line styles
- **Interactive Cursors**: Hover tooltips show precise coordinates (T, Cp)
- **Unit Conversion Engine**: Real-time transformation between J/(mol*K) and J/(kg*K)
- **Safety Warning Engine**: Automatic active banner warning when requested interval exceeds empirical limits

---

## Slide 5: Analytics, Material Ranking & Data Export
- **Analytical Integration**: Exact closed-form integration of Shomate polynomial (0.0000% discrepancy vs trapezoidal quadrature)
- **Database Ranking Tool**: Scans all 200 materials to dynamically isolate top 5 highest and lowest thermal capacities at any T
- **One-Click Export**: Publication-grade PNG plot export and clean CSV data file download

---

## Slide 6: Deployment & Submission Deliverables
- **Zero-Dependency Bundle**: Single-file dist/index.html (296 KB) containing all 200 materials and offline Chart.js engine
- **Coursework Compliance**: Full submission package ready without requiring raw source code submission as primary artifact
- **Complete Verification**: Full engineering audit log maintained in log.md
