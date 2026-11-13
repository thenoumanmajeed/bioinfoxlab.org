# CID 75791 extended computational suite

Starting molecule: supplied SDF, neutral C9H8O4, singlet. Initial r2SCAN-3c gas-phase geometry optimization and analytic frequencies completed with no imaginary vibrational modes.

ORCA 6.1.1; 12 MPI processes per job; MaxCore 1000 MB per process (nominal 12 GB, not a hard process-memory cap). Jobs run sequentially. OpenMP/BLAS threads restricted to one per MPI process to avoid oversubscription.

Electronic properties, charged states and TD-DFT: wB97X-D3/def2-TZVPD, RIJCOSX/def2-J, TightSCF, DefGrid3. TD-DFT: 40 singlet roots, full TD-DFT. Geometry/frequencies/Raman/conformer sampling: r2SCAN-3c. NMR: PBE0/pcSseg-2, GIAO, computed TMS reference at the same shielding level. NMR is gas-phase single-conformer prediction, not experimental solvent/ensemble matched.

Water uses CPCM and neutral acid; it does not predict aqueous protonation populations. Solvent comparison includes geometry relaxation and cannot alone be called a solvation free energy. Vertical charged-state energies use identical neutral geometry and identical electronic settings. IP=E(cation)-E(neutral), EA=E(neutral)-E(anion). Check spin contamination and electron binding before reporting descriptors. Relaxed-ion jobs lack frequency corrections; call differences electronic adiabatic estimates, not Gibbs energies. Fukui indices from Hirshfeld population differences depend on partitioning; orbital gap is not an optical band gap.

Conformer sampling rotates two carboxyl groups from six starting geometries; duplicate minima may occur. It is not an exhaustive conformer search. Each conformer needs converged geometry and no imaginary frequencies before relative thermochemistry is accepted. All initial property calculations refer to the original local minimum; lower minima require follow-up recalculation before claiming global ground-state properties.

No arbitrary reaction pathway, transition state, docking, periodic solid, biological activity, or pKa is inferred from a single isolated molecule. NBO requires an external licensed implementation and is not included. Failed or unconverged jobs are not results. Shieldings must be referenced before being called chemical shifts. Raman activities are not laser-specific intensities. Harmonic spectra are unscaled predictions.

Primary references: https://www.faccts.de/docs/orca/6.1/manual/ ; see spectroscopy/properties sections for TDDFT, NMR, electric properties and Raman.

## Charged-state geometry workflow revision
Hybrid geometry attempt for cation was preserved under original_hybrid_attempt. For practical geometry searches, cation, anion and triplet optimizations use r2SCAN-D4/ma-def2-TZVP (diffuse basis), followed by wB97X-D3/def2-TZVPD single-point refinement at those geometries. Electronic adiabatic estimates use the refined hybrid energies relative to the original hybrid neutral energy. No ionic thermal corrections or confirmed ionic minima are claimed without ionic frequencies. Total suite: 23 jobs.

## Symmetry-aware postprocessing

All-atom least-squares RMSD comparisons use proper rotations and four verified element/connectivity-preserving permutations. Equivalent aromatic Kekulé drawings are treated identically; hydroxyl and carbonyl oxygens remain chemically distinct. A 0.10 Å all-atom RMSD threshold groups C1/C2/C4 as near-duplicates. A separate reflection-allowed diagnostic identifies C3 as approximately mirror-related to this group. Reflections are not used to merge the proper-rotation groups, and no ensemble populations are inferred. See conformer_similarity.csv/json and Results_and_Discussion.md.

TD-DFT configuration contributions are extracted as printed by ORCA for each of the 40 singlet states in gas phase and water. ORCA orbital indices are zero-based; these printed contributions are not oscillator strengths or measured transition probabilities. ORCA_citations.bib merges the bibliography entries emitted by the actual calculation jobs.
