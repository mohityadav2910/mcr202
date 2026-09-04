# Project Execution Plan: Interactive Cp vs. T Materials Database Platform

## Executive Summary & Objectives
This project develops an interactive, high-performance computational platform for plotting, evaluating, and analysing the variation of specific heat capacity at constant pressure (Cp) with temperature (T) across **200 materials** categorized into distinct engineering classes (Metals, Ceramics, Semiconductors, Refractories, Minerals, Halides, Fluids/Gases). The platform is powered by the NIST standard **Shomate Equation**:

t = \frac{T}{1000}
C_{p,\text{molar}}(t) = A + B \cdot t + C \cdot t^2 + D \cdot t^3 + \frac{E}{t^2} \quad [\text{J}/(\text{mol}\cdot\text{K})]
C_{p,\text{specific}}(t) = \frac{C_{p,\text{molar}}(t)}{M} \times 1000 \quad [\text{J}/(\text{kg}\cdot\text{K})]

The deliverables satisfy all coursework requirements:
1. **Interactive Standalone GUI / Web Application**: Visual interactive dashboard enabling real-time curve plotting, multi-material comparisons, interactive data cursors/zooming, material property summaries, phase-transition/valid range warnings, and high-resolution export.
2. **Submission Compliance (No Source Code Primary)**: Standalone executable / packaged application or interactive HTML/JS dashboard link, screen-recorded demonstration walkthrough, and structured presentation materials for individual group members.
3. **Audit & Verification Logging**: Every phase records verification metrics and status updates into log.md.

---

## Design Philosophy: Authentic Student & Engineering Utility
- **Normal-Person / Practical Engineering Style**: The interface is intentionally styled like a clean, practical university engineering tool rather than a heavily decorated corporate showcase.
- **Minimal Decoration**: Uses plain standard HTML/MATLAB controls (standard buttons, simple select dropdowns, clear checkbox/list selectors, clean standard fonts, simple 1px borders, and neutral grey/slate/white palettes).
- **Focus on Clarity**: Clear scientific labels, proper units, readable high-contrast plots, and straightforward data comparison tables without distracting animations, neon accents, or complex glassmorphism.

## Technical Stack & Architecture
- **Data Ingestion & Thermodynamic Engine**: Dual-mode implementation:
  1. MATLAB App Designer GUI (CpExplorer.mlapp / standalone compiled executable) taking advantage of the local MATLAB R2026a environment.
  2. Standalone zero-dependency Web Application (index.html + chart.js + embedded materials_data.json) runnable locally or hosted via GitHub Pages/Vercel for immediate grading and browser link sharing.
- **Thermodynamic Model**: 5-parameter NIST Shomate Formulation with strict Tmin - Tmax boundary checking and analytical temperature integration for enthalpy increments.
- **Database Scope**: Complete 200 materials from MCR202_Cp_Database_200_Materials.xlsx spanning 11 categories: Metals & Alloys, Ceramics (Oxides, Carbides, Nitrides, Borides, Silicides), Semiconductors, Refractories & Minerals, Carbonates, Sulfates, Halides & Salts, Technological Fluids & Gases.

---

## Phase-Wise Implementation Breakdown

### Phase 1: Database Extraction, Thermodynamic Core & Verification Benchmarks

#### 1. Feature
- Extract all 200 material records, chemical formulas, NIST Shomate parameters (A, B, C, D, E), validity ranges (Tmin, Tmax), units, sources, and molar masses from MCR202_Cp_Database_200_Materials.xlsx.
- Build vectorized thermodynamic calculation modules in both MATLAB (evaluateCp.m) and JSON/JS (materials_data.json, cpEngine.js) supporting:
  - Molar heat capacity (J/(mol*K)).
  - Specific heat capacity (J/(kg*K) and cal/(g*degC)).
  - Strict range boundaries (Tmin <= T <= Tmax) with extrapolation alert flags.
  - Derived thermodynamic properties: Enthalpy increment (H(T) - H(298.15)) and Entropy (S(T)) via analytical integration.

#### 2. How
- Read Excel sheets using MATLAB script / automation to extract all fields accurately.
- Structure data into a high-performance normalized JSON dataset (data/materials_data.json).
- Implement vectorised evaluation for arbitrary temperature grids (T = linspace(Tmin, Tmax, N)).
- Implement safety clamps and warning state flags when user queries temperatures beyond Tmin - Tmax.

#### 3. What Files Changed
- **New Files**:
  - data/materials_data.json (Structured JSON of 200 materials with Shomate coefficients, ranges, and citations).
  - src/evaluateCp.m (Vectorized MATLAB thermodynamic evaluation function).
  - src/extract_data.m (Data pipeline script transforming Excel into validated structured matrices).
  - src/cpEngine.js (Client-side JavaScript thermodynamic calculation engine).
- **Modified Files**:
  - log.md (Log Phase 1 entry, verification benchmarks, material count, formula checks).

#### 4. Testing & Verification
- Verify that exactly 200 material entries load without missing coefficients (A, B, C, D, E).
- Cross-validate calculated Cp at T = 298.15 K and T = 500 K against literature values for benchmark elements (Al, Cu, Fe) with discrepancy < 0.01%.
- Confirm extrapolation warnings trigger when evaluated at T < Tmin or T > Tmax.

#### 5. Logging to log.md
- Append Phase 1 timestamp, material count tally by class, numerical validation discrepancies (Delta < 0.01%), and execution status to log.md.

---

### Phase 2: Interactive GUI, Multi-Curve Visualizer & Category Filter Engine

#### 1. Feature
- Modern, visually engaging graphical user interface featuring:
  - Material search bar with auto-complete and live search.
  - Category selector chips/dropdowns (Metals, Ceramics, Semiconductors, Refractories, Polymers, Salts, etc.).
  - Multi-material selection with simultaneous curve overlay (up to 10 materials concurrently).
  - Responsive temperature slider / manual range inputs (T_start, T_stop, Delta_T).
  - Unit toggle: J/(mol*K) <=> J/(kg*K).
  - Interactive plot features: Zoom, pan, reset, hover tooltips, and data tips showing (T, Cp) values.
  - Visual out-of-range indicator: Shaded validity zones and warning badges when a curve enters extrapolation.

#### 2. How
- Construct a dedicated MATLAB App Designer platform (CpExplorer.mlapp) utilizing uiaxes, uidropdown, uilistbox (multiselect), and uislider.
- Construct a mirrored high-aesthetic web platform (gui/index.html, gui/styles.css, gui/app.js using Chart.js) providing instantaneous cross-platform launch without licensing requirements.
- Dynamic color palette assignment ensuring distinguishable curves with legends displaying material formula and category.

#### 3. What Files Changed
- **New Files**:
  - src/CpExplorer.mlapp (Interactive MATLAB App Designer GUI).
  - gui/index.html (Interactive dashboard markup).
  - gui/styles.css (Clean, minimal, utilitarian engineering stylesheet (standard grey/white controls, plain borders, zero flashy effects)).
  - gui/app.js (Interactive UI logic, Chart.js multi-dataset binding, search filter).
- **Modified Files**:
  - log.md (Phase 2 GUI functional verification, test cases, and latency logs).

#### 4. Testing & Verification
- Multi-material plotting test: Select 5 materials from different categories (Al, SiC, GaAs, Al2O3, H2O) and verify simultaneous rendering, coordinate tooltips, unit recalibration, and sub-50ms resampling latency.

#### 5. Logging to log.md
- Log UI component test results, rendering frame rates, responsive filter benchmarks, and user event validation into log.md.

---

### Phase 3: Analytical Toolset, Material Comparison, Ranking & Data Export

#### 1. Feature
- Comparative Analysis Table: Side-by-side comparison of selected materials displaying Cp at 298.15 K, Cp at Tmax, mean dCp/dT, and integral heat absorption (integral Cp dT).
- Material Ranking Tool: Instant ranking of the database based on Cp at any user-selected temperature (top-10 highest vs lowest specific heat materials).
- Metadata Card: Displays formula, chemical category, bibliographic citation, molar mass, and validity window.
- Export Engine: High-resolution graph export (PNG, SVG, PDF at 300 DPI) and formatted data export (CSV, Excel) of computed (T, Cp) curves.

#### 2. How
- Implement numerical derivative and trapz/analytical integration functions for thermal absorption calculations.
- Build sorting algorithms over the loaded 200 materials table based on calculated Cp(T_target).
- Hook HTML5 Canvas toDataURL / MATLAB exportgraphics for 300 DPI publication-grade vector/raster plots.
- Generate downloadable CSV/Excel blobs directly in browser/MATLAB.

#### 3. What Files Changed
- **New Files**:
  - src/analysisTools.m (MATLAB ranking, derivative, and integral routines).
  - gui/analysis.js (Client-side comparative table, ranking, and export handlers).
  - src/exportPlot.m (MATLAB export helper for publication figures).
- **Modified Files**:
  - gui/index.html (Added Comparative Analytics tab, Ranking view, and Export toolbar).
  - gui/styles.css (Styles for comparison cards, ranking tables, and action buttons).
  - log.md (Phase 3 analytics accuracy audit and export integrity verification).

#### 4. Testing & Verification
- Numerical validation of thermal integral against trapezoidal integration with 10^4 points (Delta < 0.001%).
- Verify ranking tool correctly sorts high-Cp materials vs low-Cp heavy refractory metals.
- Test CSV and PNG export across multiple screen resolutions and ensure axes, legends, and units are legible.

#### 5. Logging to log.md
- Log analytical engine benchmark results, export validation checks, and integrity stats into log.md.

---

### Phase 4: Standalone Packaging, Offline Readiness & Video Walkthrough Asset Preparation

#### 1. Feature
- Fulfill submission rule: The MATLAB or Python source code must not be submitted as the primary assignment submission.
- Package application into standalone executable / packaged web app and self-contained zero-dependency browser bundle.
- Prepare video demonstration storyboard and script covering material selection, generation of Cp-T curves, comparison of different materials, and interactive features.

#### 2. How
- MATLAB Application Compiler configuration / standalone deployment packaging.
- Self-contained web bundling (all assets, CSS, Chart.js scripts, and 200-material dataset embedded locally with no external CDN dependency).
- Author detailed demonstration storyboard (docs/video_script_and_storyboard.md) with timestamps, narration cues, and screen capture checklist.

#### 3. What Files Changed
- **New Files**:
  - dist/index.html (Single-bundle standalone zero-dependency distribution).
  - docs/video_script_and_storyboard.md (Video demonstration walkthrough script and scene sequence).
  - docs/deployment_guide.md (Instructions on running the standalone application and hosted web link).
- **Modified Files**:
  - log.md (Phase 4 build metrics, bundle size, offline verification log).

#### 4. Testing & Verification
- Test opening dist/index.html in an offline environment to verify 100% functionality without CDN errors.
- Test standalone executable launch and verify all 200 materials load and render curves within 1 second.
- Review video script against coursework criteria (selection, generation, comparison, interactive features).

#### 5. Logging to log.md
- Record package size, offline compatibility test results, and storyboard verification in log.md.

---

### Phase 5: Individual PowerPoint Presentations Preparation & Final Project Audit

#### 1. Feature
- Satisfy individual submission requirement: Two separate PowerPoint presentations, clearly different in style, organization, visual design, explanation, and demonstrated skills.
- Presentation 1 (Student A): Thermodynamic principles, Dulong-Petit limits, Debye temperature behavior, Shomate formulations, material class comparisons.
- Presentation 2 (Student B): Computational platform architecture, UI/UX engineering, real-time filtering, numerical precision, and scalability.

#### 2. How
- Generate slide-by-slide markdown scripts and deck outlines (docs/Presentation_Student_A_Thermodynamics.md and docs/Presentation_Student_B_Software_Engineering.md).
- Conduct final end-to-end audit of all files and checklist requirements against PDF guidelines.

#### 3. What Files Changed
- **New Files**:
  - docs/Presentation_Student_A_Thermodynamics.md (Slide deck 1 content & speaker notes).
  - docs/Presentation_Student_B_Software_Engineering.md (Slide deck 2 content & speaker notes).
  - docs/final_submission_checklist.md (Cross-check against PDF guidelines).
- **Modified Files**:
  - log.md (Final audit entry, complete validation summary, deliverables sign-off).

#### 4. Testing & Verification
- Audit slide decks for distinct structure, style, and content differentiation.
- Cross-check all coursework requirements against Group Project_Specific heats (2).pdf.

#### 5. Logging to log.md
- Final sign-off log entry documenting 100% requirement fulfillment and deliverables status.

---

## Deliverables Summary

| Deliverable | Format | Purpose | Coursework Requirement Met |
| :--- | :--- | :--- | :--- |
| **Interactive Platform** | Standalone HTML5/JS Dashboard + MATLAB App | Interactive Cp-T visualization for 200 materials | Requirement 1 (Executable / link / dashboard) |
| **Video Demonstration Script** | Markdown Storyboard & Walkthrough Script | Scripted guide for 3-5 min screen recording | Requirement 2 (Demonstration video) |
| **Presentation Deck 1** | Slide Specification & Script (Student A) | Thermodynamics & Materials Science emphasis | Requirement 3 (Individual PPT - Member 1) |
| **Presentation Deck 2** | Slide Specification & Script (Student B) | Computational Architecture & UX emphasis | Requirement 3 (Individual PPT - Member 2) |
| **Audit Log** | log.md | Verification stats, error checks, phase milestones | Project governance & verification |
