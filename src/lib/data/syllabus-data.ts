export interface SyllabusTopic {
    title: string;
    content: string;
}

export interface SyllabusSubject {
    subject: string;
    topics: SyllabusTopic[];
}

export const syllabus: SyllabusSubject[] = [
    {
        subject: 'Physics',
        topics: [
            {
                title: '1. Mechanics and Properties of Matter',
                content: "Law of conservation of linear momentum and its applications. Static and kinetic friction - laws of friction - rolling friction. Work done by a constant force and a variable force; kinetic energy - work-energy theorem- power. Conservative forces: conservation of mechanical energy (kinetic and potential energies)- non-conservative forces: motion in a vertical circle - elastic and inelastic collisions. Elastic behaviour - Stress-strain relationship - Hooke's law - Young's modulus - bulk modulus - shear modulus of rigidity - Poisson's ratio - elastic energy. Viscosity - Stokes' law - terminal velocity - streamline and turbulent flow - critical velocity. Bernoulli's theorem and its applications."
            },
            {
                title: '2. Heat and Thermodynamics',
                content: "Zeroeth law of thermodynamics- Temperature. First law of thermodynamics- Internal energy-Heat-Work-Isothermal and Adiabatic processes. Second law of thermodynamics- Reversible and Irreversible processes. Thermal expansion- Heat Capacity- Cp, Cv - latent heat, Qualitative idea of Blackbody radiation: Wein's displacement law- Stefan's law."
            },
            {
                title: '3. Electrostatics',
                content: "Charges and their conservation; Coulomb’s law - superposition principle. Electric field – electric field due to a point charge, electric field lines; electric dipole, electric field intensity due to a dipole - behaviour of a dipole in a uniform electric field. Electric potential - potential differenceelectric potential due to a point charge and dipole - equipotential surfaces – electrical potential energy of a system of two point charges. Electric flux-Gauss’s law and its applications. Electrostatic induction-capacitor and capacitance – dielectrics- electric polarisation – parallel plate capacitor with and without dielectric – applications of capacitor – energy stored in a capacitor - Capacitors in series and in parallel – Van de Graaff generator."
            },
            {
                title: '4. Current Electricity & Magnetic Effects of Electric Current',
                content: "Electric Current – drift velocity and mobility and their relation with electric current. Ohm’s law, electrical resistance - V-I characteristics – electrical resistivity and conductivity-classification of materials in terms of conductivity – Carbon resistors – colour code for carbon resistors - combination of resistors – series and parallel – temperature dependence of resistance – internal resistance of a cell – potential difference and emf of a cell - combinations of cells in series and in parallel. Kirchoff’s law – Wheatstone’s Bridge and its application - Metrebridge - special case of Wheatstone bridge - Potentiometer principle - comparing the emf of two cells. Magnetic effect of electric current – Concept of magnetic field - Oersted’s experiment – Biot-Savart law- Magnetic field due to a current carrying straight wire and circular coil – Tangent galvanometer – Bar magnet as an equivalent solenoid – magnetic field lines. Ampere’s circuital law and its application. Force on a moving charge in uniform magnetic field and electric field – cyclotron – Force on current carrying conductor in a uniform magnetic field – Forces between two parallel current carrying conductors - definition of ampere. Torque experienced by a current loop in a uniform magnetic field - moving coil galvanometer – conversion to ammeter and voltmeter – current loop as a magnetic dipole - Magnetic dipole moment of a revolving electron."
            },
            {
                title: '5. Electromagnetic Induction and Alternating Current',
                content: "Electromagnetic induction - Faraday’s law - induced emf and current - Lenz’s law. Self induction - Mutual induction - self inductance of a long solenoid - mutual inductance of two long solenoids. Methods of inducing emf - (i) by changing magnetic induction (ii) by changing area enclosed by the coil and (iii) by changing the orientation of the coil. AC generator - (Single phase, three phase). Eddy current - applications - transformer - Alternating current - AC circuit with resistance - AC circuit with inductor - AC circuit with capacitor - LCR series circuit - Resonance and Q - factor - power in AC circuits."
            },
            {
                title: '6. Optics',
                content: "Reflection of light, spherical mirrors, mirror formula. Refraction of light, total internal reflection and its applications, refraction at spherical surfaces, lenses, thin lens formula, lens maker’s formula. Magnification, power of a lens, Resolving power, combination of thin lenses in contact, combination of a lens and a mirror. Refraction and dispersion of light through a prism. Wavefront and Huygens’s principle - Reflection, total internal reflection and refraction of plane wave at a plane surface using wavefronts. Interference - Young’s double slit experiment and expression for fringe width - coherent source - Formation of colours in thin films - Newton’s rings. Diffraction - differences between interference and diffraction of light. Polarisation of light waves - polarisation by reflection - Brewster’s law - double refraction - nicol prism - uses of plane polarised light."
            },
            {
                title: '7. Dual Nature of Radiation, Atomic & Nuclear Physics',
                content: "Displacement current - Electromagnetic waves and their characteristics - Transverse nature of electromagnetic waves - Electromagnetic spectrum - Photoelectric effect - Light waves and photons - particle nature of light - photocells and their applications. Atomic structure – discovery of the electron – specific charge (Thomson’s method) and charge of the electron (Millikan’s oil drop method) – alpha scattering – Rutherford’s atom model. Nuclear properties - nuclear radii, masses, binding energy, density, charge - isotopes, isobars and isotones - nuclear mass defect - binding energy - stability of nuclei. Nature of nuclear forces - Radioactivity - alpha, beta and gamma radiations and their properties - Radioactive decay law - half life - mean life - artificial radioactivity - radio isotopes - effects and uses. Radio carbon dating. Nuclear fission - chain reaction - atom bomb - nuclear reactor - nuclear fusion."
            },
            {
                title: '8. Semiconductor Devices and their Applications',
                content: "Semiconductor basics - energy bands in solids: difference between metals, insulators and semiconductors - semiconductor doping - Intrinsic and Extrinsic semiconductors. Formation of P-N Junction - Barrier potential and depletion layer-P-N Junction diode - Forward and reverse bias characteristics - diode as a rectifier - Zener diode- LED. Junction transistors - characteristics - transistor as a switch - transistor as an amplifier - transistor as an oscillator. Logic gates - NOT, OR, AND, EXOR using discrete components - NAND and NOR gates as universal gates - De Morgan’s theorem - Laws and theorems of Boolean algebra."
            }
        ]
    },
    {
        subject: 'Chemistry',
        topics: [
            {
                title: '1. Physical Chemistry',
                content: "Atomic Structure - Bohr’s atomic model-Sommerfeld’s extension of atomic structure; Electronic configuration and Quantum numbers; Shapes of s, p, d, f orbitals - Pauli’s exclusion principle - Hund’s Rule of maximum multiplicity- Aufbau principle. Emission and absorption spectra, line and band spectra; Hydrogen spectrum – Lyman, Balmer, Paschen, Brackett and Pfund series; de Broglie’s theory; Heisenberg’s uncertainty principle – wave nature of electron – Schrodinger wave equation (No derivation). Eigen values and eigen functions. Chemicalbonding and hybridization of atomic orbitals involving s, p and d orbitals. Thermodynamics, Chemical Equilibrium and Chemical Kinetics - I and II Laws of thermodynamics – spontaneous and non-spontaneous processes, entropy, Gibb’s free energy – Standard Gibbs free energy change (ΔG0) and chemical equilibrium – significance of entropy.Rate of a chemical reaction, factors affecting rates of reaction: concentration, temperature, pressure and catalyst; Law of mass action – Le Chatelier’s principle, applications of chemical equilibrium. Rate expression, order, and molecularity of reactions, zero order, first order and pseudo first order reaction – half-life period. Determination of rate constant and order of reaction. Temperature dependence of rate constant – Arrhenius equation, activation energy and its calculation; elementary concept of collision theory of bimolecular gaseous reactions. Solutions - Colligative properties of dilute solutions; Different methods for expressing the concentration of solution - molality, molarity, mole fraction, percentage, the vapour pressure of solutions and Raoult's Law - Ideal and non-ideal solutions, vapour pressure - composition, plots for ideal and non-ideal solutions."
            },
            {
                title: '2. Inorganic and Material Chemistry',
                content: "The s-block elements – properties and chemical reactivity of alkali and alkaline earth metals. The p-block elements – Phosphorous compounds: PCl3, PCl5 – Oxides, Hydrogen halides, Inter-halogen compounds and Xenon fluoride compounds. General characteristics of d – block elements – Electronic Configuration – Oxidation states of first row transition elements and their colours. Occurrence and principles of extraction: Copper, Silver, Gold and Zinc. Preparation and properties of CuSO4, AgNO3and K2Cr2O7. Lanthanides – Introduction, electronic configuration, general characteristics, oxidation state – lanthanide contraction, uses, brief comparison of Lanthanides and Actinides. Introduction to coordination chemistry - IUPAC nomenclature of mononuclear coordination compounds; Isomerism, Geometrical isomerism in 4-coordinate, 6-coordinate complexes. Theories on coordination compounds – Werner’s theory (brief), Valence Bond theory. Uses of coordination compounds. Bioinorganic compounds (Haemoglobin and chlorophyll). Solid-State Chemistry - Lattice – unit cell, systems, types of crystals, packing in solids; Ionic crystals – Imperfections in solids – point defects, X-Ray diffraction – Electrical Property, Amorphous solids (elementary ideas only). Surface Chemistry - Adsorption- physisorption and chemisorption; Catalysis – homogeneous and heterogeneous catalysis."
            },
            {
                title: '3. Analytical Chemistry',
                content: "Electrochemistry - Redox reactions; Theory of electrical conductance; metallic and electrolytic conductance. Faraday’s laws – theory of strong electrolytes – Specific resistance, specific conductance, equivalent and molar conductance – Variation of conductance with dilution – Kohlrausch’s Law – Ionic product of water, pH, and pH– buffer solutions – use of pH values. Cells – Electrodes and electrode potentials – construction of cell, EMF values and standard electrode potentials, Nernst equation and its application to chemical cells. Relation between Gibbs energy change and EMF of a cell, dry cell, electrolytic cells and Galvanic cells; lead accumulator; Fuel cells, Corrosion, and its prevention. Environmental Chemistry - Environmental pollution - Atmospheric, water and soil."
            },
            {
                title: '4. Basic Principles of Organic Chemistry',
                content: "Carbon – tetravalency, hybridization; Classification of organic compounds – functional groups; Homologous series; Nomenclature (IUPAC); Homolytic and heterolytic bond cleavage; carbocations, carbanions and free radicals; electrophiles and nucleophiles; Inductive effect, electromeric effect, resonance and hyperconjugation. Common organic reactions - Substitution, addition, elimination and rearrangement. Isomerism in Organic Compounds: Definition, Classification – structural isomerism, stereo isomerism – geometrical and optical isomerism. Optical activity - chirality – compounds containing chiral centres – R, S notation, D, L notation. Detection of the functional groups in organic compounds: Hydroxyl (alcoholic and phenolic), carbonyl (aldehyde and ketones) carboxyl and amino groups."
            },
            {
                title: '5. Properties and Chemistry of Functionalized Organic Compounds',
                content: "Alcohols and Ethers - Nomenclature of alcohols – Classification of alcohols - distinction between 1°, 2° and 3° alcohols – General methods of preparation of primary alcohols, properties. Methods of preparation of dihydric alcohols: Glycol – Properties – Uses. Methods of preparation of trihydric alcohols - Properties – Uses. Aromatic alcohols – preparation and properties of phenols and benzyl alcohol; Ethers – Nomenclature of ethers – general methods of preparation of aliphatic ethers - Properties – Uses. Aromatic ethers – Preparation of Anisole – Uses. Carbonyl Compounds - Nomenclature of carbonyl compounds – Comparison of aldehydes and ketones. General methods of preparation of aldehydes – Properties – Uses. Aromatic aldehydes – Preparation of benzaldehyde – Properties and Uses. Ketones – general methods of preparation of aliphatic ketones (acetone) – Properties – Uses. Aromatic ketones – preparation of acetophenone – Properties – Uses, preparation of benzophenone – Properties. Name reactions; Clemmensen reduction, Wolff – Kishner reduction, Cannizzaro reaction, Claisen Schmidt reaction, Benzoin Condensation, Aldol Condensation. Preparation and applications of Grignard reagents. Carboxylic Acids and their derivatives - Nomenclature – Preparation of aliphatic monocarboxylic acids – formic acid – Properties – Uses. Monohydroxy mono carboxylic acids; Lactic acid – Synthesis of lactic acid. Aliphatic dicarboxylic acids; Preparation of oxalic and succinic acids. Aromatic acids: Benzoic and Salicylic acids – Properties – Uses. Derivatives of carboxylic acids; acetyl chloride (CH3COCl) – Preparation – Properties – Uses. Preparation of acetamide, Properties – acetic anhydride – Preparation, Properties. Preparation of esters – methyl acetate – Properties."
            },
            {
                title: '6. Organic Nitrogen Compounds',
                content: "Organic Nitrogen Compounds - Aliphatic nitro compounds – Preparation of aliphatic nitroalkanes – Properties – Uses. Aromatic nitro compounds – Preparation – Properties – Uses. Distinction between aliphatic and aromatic nitro compounds. Amines; aliphatic amines – General methods of preparation – Properties – Distinction between 1°, 2° and 3°amines. Aromatic amines – Synthesis of benzylamine – Properties, Aniline – Preparation – Properties – Uses. Differences between aliphatic and aromatic amines. Aliphatic nitriles – Preparation – properties – Uses. Diazonium salts – Preparation of benzene diazonium chloride – Properties."
            },
            {
                title: '7. Biomolecules and Polymers',
                content: "Carbohydrates – Distinction between sugars and non-sugars, structural formulae of glucose, fructose, and sucrose, with their linkages, invert sugar – definition, examples of oligo and polysaccharides. Amino acids and Proteins – Classification of amino acids with examples, Peptides - properties of peptide bond; Proteins - primary, secondary, tertiary and quaternary structure (qualitative idea only), denaturation of proteins, enzymes. Lipids - Definition, classification with examples, difference between fats, oils, and waxes. Nucleic acids – Chemical constitution of DNA and RNA. Polymers - Classification – Natural and synthetic, methods of polymerization (addition and condensation), copolymerization. Some important polymers: natural and synthetic like polythene, nylon, polyesters, Bakelite, rubber. Biodegradable and non-biodegradable polymers."
            }
        ]
    }
];
