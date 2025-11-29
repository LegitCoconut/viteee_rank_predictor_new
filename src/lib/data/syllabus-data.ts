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
    }
];
