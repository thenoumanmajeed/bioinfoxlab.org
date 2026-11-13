# Figure captions

## 1. Optimized molecular geometry

File: `optimized_molecule.png`

Method: r²SCAN-3c

Optimized neutral gas-phase local minimum. All 57 vibrational frequencies are positive. Carbon is gray, oxygen red and hydrogen white; labels match the one-based geometry tables.

## 2. Predicted infrared spectrum

File: `IR_gas.png`

Method: r²SCAN-3c

Unscaled gas-phase harmonic IR spectrum with Lorentzian display broadening of 20 cm⁻¹ FWHM. Band positions and intensities are computational predictions.

## 3. Predicted Raman activities

File: `Raman_gas.png`

Method: r²SCAN-3c

Unscaled gas-phase harmonic Raman activities, broadened with a 20 cm⁻¹ Lorentzian FWHM. Activities are not laser- or temperature-specific experimental intensities.

## 4. Gas-phase UV absorption

File: `UV_gas.png`

Method: wB97X-D3/def2-TZVPD

Forty singlet vertical full TD-DFT transitions. The static display uses Gaussian broadening of 0.25 eV FWHM; it is not experimentally calibrated.

## 5. Neutral-water-model UV absorption

File: `UV_water.png`

Method: wB97X-D3/def2-TZVPD; CPCM water

Forty singlet vertical full TD-DFT transitions at the relaxed neutral CPCM-water geometry. Static Gaussian broadening is 0.25 eV FWHM; no pH-dependent protonation ensemble is modeled.

## 6. Predicted hydrogen chemical shifts

File: `NMR_H.png`

Method: PBE0/pcSseg-2; GIAO

Gas-phase atom-resolved ¹H shifts from calculated TMS referencing. One equal-height stick per atom; no J coupling, exchange, solvent or conformer averaging.

## 7. Predicted carbon chemical shifts

File: `NMR_C.png`

Method: PBE0/pcSseg-2; GIAO

Gas-phase atom-resolved ¹³C shifts from calculated TMS referencing. One equal-height stick per atom; no full experimental spectral simulation is implied.

## 8. Gas-phase Hirshfeld charges

File: `charges_gas.png`

Method: wB97X-D3/def2-TZVPD

Hirshfeld charges at the original neutral gas-phase local minimum. Charges depend on the population scheme and are not measured observables.

## 9. CPCM-water Hirshfeld charges

File: `charges_water.png`

Method: wB97X-D3/def2-TZVPD; CPCM water

Hirshfeld charges at the relaxed neutral CPCM-water geometry. Values describe this model and do not determine aqueous protonation populations.

## 10. Relative Gibbs energies of sampled candidates

File: `conformer_comparison.png`

Method: r²SCAN-3c

Relative printed Gibbs energies of seven frequency-validated candidates. Repeated and mirror-related structures are retained; the plot does not represent seven unique conformers, ensemble populations or a proven global minimum.

## 11. Symmetry-aware conformer similarity

File: `conformer_similarity.png`

Method: All-atom proper-rotation least-squares alignment

Pairwise all-atom RMSD after four verified connectivity-preserving permutations, with equivalent aromatic Kekulé drawings treated identically. Reflections are excluded; C1/C2/C4 are near-duplicates at a 0.10 Å grouping threshold.

## 12. HOMO orbital, gas

File: `HOMO_gas.png`

Method: wB97X-D3/def2-TZVPD

Finite-basis HOMO Kohn–Sham orbital at the original gas-phase geometry. Colors indicate opposite orbital phases, not atomic charge. The displayed isovalue is stated on the figure. Virtual-orbital energy does not establish a bound attached-electron state.

## 13. LUMO orbital, gas

File: `LUMO_gas.png`

Method: wB97X-D3/def2-TZVPD

Finite-basis LUMO Kohn–Sham orbital at the original gas-phase geometry. Colors indicate opposite orbital phases, not atomic charge. The displayed isovalue is stated on the figure. Virtual-orbital energy does not establish a bound attached-electron state.

## 14. Electrostatic potential, gas

File: `ESP_gas.png`

Method: wB97X-D3/def2-TZVPD

Electrostatic potential on the 0.001 e/bohr³ electron-density isosurface. A common −0.05 to +0.05 a.u. scale is used; red is negative and blue positive potential. Surface values are sampled from the calculated wavefunction.

## 15. HOMO orbital, water

File: `HOMO_water.png`

Method: wB97X-D3/def2-TZVPD; CPCM water

Finite-basis HOMO Kohn–Sham orbital at the relaxed neutral CPCM-water geometry. Colors indicate opposite orbital phases, not atomic charge. The displayed isovalue is stated on the figure. Virtual-orbital energy does not establish a bound attached-electron state.

## 16. LUMO orbital, water

File: `LUMO_water.png`

Method: wB97X-D3/def2-TZVPD; CPCM water

Finite-basis LUMO Kohn–Sham orbital at the relaxed neutral CPCM-water geometry. Colors indicate opposite orbital phases, not atomic charge. The displayed isovalue is stated on the figure. Virtual-orbital energy does not establish a bound attached-electron state.

## 17. Electrostatic potential, water

File: `ESP_water.png`

Method: wB97X-D3/def2-TZVPD; CPCM water

Electrostatic potential on the 0.001 e/bohr³ electron-density isosurface. A common −0.05 to +0.05 a.u. scale is used; red is negative and blue positive potential. Surface values are sampled from the calculated wavefunction.
