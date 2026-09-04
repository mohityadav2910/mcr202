# Video Demonstration Storyboard & Walkthrough Script
**Project**: Interactive Specific Heat Capacity (Cp vs. T) Computational Platform
**Target Duration**: 3 to 4 Minutes
**Demonstrators**: Group Members (Student A & Student B)
**Deliverable Mapping**: Coursework Requirement 2 (Short Demonstration Video)

---

## Video Scene-by-Scene Breakdown

### Scene 1: Platform Introduction & Layout Overview (0:00 - 0:45)
- **On-Screen Visual**:
  - Open dist/index.html in any web browser (Chrome/Edge/Firefox).
  - Show the clean, functional interface: Header title, Left Sidebar controls, Main Chart canvas, and Lower Data Tables.
- **Spoken Narration (Student A)**:
  > Hello, welcome to our group demonstration of the interactive specific heat capacity platform. We developed this platform to compute, plot, and analyse the temperature variation of specific heat capacity (Cp) across 200 engineering materials. The platform relies on empirical NIST Shomate polynomials with strict valid temperature checking. The interface has been designed to be clean, intuitive, and practical for engineering students and researchers, placing core controls on the left and scientific visualisations on the right.

---

### Scene 2: Material Selection & Category Filtering (0:45 - 1:30)
- **On-Screen Visual**:
  - Click on the Category Dropdown and cycle through categories: Metal (38), Ceramic (Oxide) (41), Semiconductor (12), Refractory & Mineral (20).
  - Type Copper in the search box; show the list filter to Copper.
  - Type Al to demonstrate chemical formula search.
  - Check 3 materials from different classes: Aluminium (Al), Silicon Carbide (SiC), and Copper (Cu).
- **Spoken Narration (Student B)**:
  > Here we demonstrate material discovery. The database contains 200 distinct materials categorized into 11 engineering classes. Using the search box, we can locate materials instantly by either common name or chemical formula. When materials are selected from the checklist, the interactive plotting canvas updates immediately with distinct, legible curve styles and legends.

---

### Scene 3: Cp-T Curve Generation & Temperature Resampling (1:30 - 2:15)
- **On-Screen Visual**:
  - Adjust the temperature range: set Tmin = 200 K, Tmax = 1000 K, and Step = 5 K.
  - Hover cursor over the curves to show interactive data tips showing exact (T, Cp) values.
  - Toggle units from J/(mol*K) to J/(kg*K). Point out how the Y-axis label and scale automatically adjust.
- **Spoken Narration (Student A)**:
  > In the controls panel, users can define custom temperature ranges and step sizes. As we adjust the range, the platform recalculates the Shomate polynomial curves instantaneously. Hovering over any point displays interactive coordinate values. We can also seamlessly switch between molar heat capacity in Joules per mole-Kelvin and gravimetric specific heat in Joules per kilogram-Kelvin, converted using each material precise molar mass.

---

### Scene 4: Out-of-Range Safety Warnings & Comparative Table (2:15 - 3:00)
- **On-Screen Visual**:
  - Increase Tmax to 1800 K.
  - Show the Temperature Range Warning Banner appear, highlighting which materials (e.g. Aluminium beyond 933 K) are undergoing extrapolation.
  - Scroll down to the Comparative Material Analysis Table.
  - Highlight the ambient reference Cp(298.15 K), molar masses, valid temperature intervals, literature sources, and the computed heat absorption Delta H [kJ/kg].
- **Spoken Narration (Student B)**:
  > Thermodynamic polynomials are only valid within specific experimental temperature windows. If a user sets a temperature that exceeds a material valid range, our platform immediately highlights an active warning banner to prevent unphysical extrapolation. Below the graph, the comparative table provides instant access to ambient reference values and calculates the total heat absorption delta H by analytically integrating the Cp curve over our chosen temperature span.

---

### Scene 5: Material Ranking Tool & Data Export (3:00 - 3:45)
- **On-Screen Visual**:
  - Navigate to the Material Ranking Tool.
  - Change the evaluation temperature to 500 K. Show top 5 highest and top 5 lowest materials dynamically update.
  - Click Export CSV; open the downloaded CSV in Excel to show formatted columns.
  - Click Export PNG; display the exported graph file.
- **Spoken Narration (Student A & B)**:
  > Finally, the platform includes a ranking utility that scans the entire 200-material database to identify materials with the highest and lowest thermal capacities at any specified temperature. Users can export the generated data to a clean CSV spreadsheet for downstream numerical modeling, or export high-resolution PNG plots for technical documentation. This concludes our demonstration of the platform.

---

## Screen Recording Checklist for Students
- [ ] Record at 1080p (1920x1080) resolution.
- [ ] Ensure microphone audio is clear and free of background noise.
- [ ] Display cursor clearly when demonstrating hover tooltips and dropdown selection.
- [ ] Confirm video length is between 3:00 and 4:30 minutes.
