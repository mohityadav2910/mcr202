# Final Coursework Submission Checklist & Audit
**Project**: Interactive Specific Heat Capacity (Cp vs. T) Materials Database Platform
**Specification Reference**: Group Project_Specific heats (2).pdf

---

## 1. Technical Requirements
- [x] Calculation & display of Cp(T) using equations & coefficients from reliable thermodynamic tables: NIST Shomate polynomials used across all materials.
- [x] Minimum of 200 materials: Database contains exactly 200 materials (data/materials_data.json).
- [x] Covering different classes: Metals & alloys, Ceramics (Oxides, Carbides, Nitrides, Borides, Silicides), Semiconductors, Refractories & Minerals, Carbonates, Sulfates, Halides/Salts, Fluids/Gases.
- [x] Data sources properly cited: NIST Chemistry WebBook cited for each record.

---

## 2. Interactive Presentation Features
- [x] Selection of a material from searchable list or dropdown: Implemented.
- [x] Selection of material categories: Implemented.
- [x] Plotting of one or multiple materials simultaneously: Implemented.
- [x] Comparison of Cp values of different materials: Implemented (both graphical overlay and comparative table).
- [x] User-defined temperature ranges: Implemented (Tmin, Tmax, Step controls).
- [x] Display of material name, formula, category, and data source: Implemented in table and cards.
- [x] Interactive zooming, panning, cursor values, or data tips: Implemented via Chart.js / MATLAB.
- [x] Clear axis titles, units, legends, and labels: Implemented for both molar and specific units.
- [x] Warning when selected temperature lies outside valid range: Active range warning banner implemented.
- [x] Additional innovative features: Material ranking tool (highest/lowest extremes), analytical heat absorption (delta H), PNG export, CSV export.

---

## 3. Submission Deliverables Compliance
- [x] Primary submission is NOT source code: Standalone platform package (dist/index.html) provided.
- [x] Working link / executable / dashboard: Provided (dist/index.html and src/CpExplorer.m).
- [x] Video walkthrough script prepared: docs/video_script_and_storyboard.md.
- [x] Two separate PowerPoint presentations with different focus and style:
  - Presentation 1 (Student A - Thermodynamics & Physics): docs/Presentation_Student_A_Thermodynamics.md
  - Presentation 2 (Student B - Computational Engineering & Architecture): docs/Presentation_Student_B_Software_Engineering.md
