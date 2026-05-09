export type Campus = 'vellore' | 'chennai' | 'ap' | 'bhopal';

export type Domain = 'computer-science' | 'electronics' | 'mechanical' | 'core';

export interface CourseData {
  id: string;
  campus: Campus;
  course: string;
  shortName: string;
  domain: Domain;
  categories: [number, number, number, number, number];
  isNewCourse: boolean;
  notes?: string;
}

export const CAMPUS_LABELS: Record<Campus, string> = {
  vellore: 'VIT Vellore',
  chennai: 'VIT Chennai',
  ap: 'VIT AP',
  bhopal: 'VIT Bhopal',
};

export const CAMPUS_SHORT: Record<Campus, string> = {
  vellore: 'Vellore',
  chennai: 'Chennai',
  ap: 'AP',
  bhopal: 'Bhopal',
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  'computer-science': 'Computer Science',
  electronics: 'Electronics',
  mechanical: 'Mechanical',
  core: 'Core (Civil/Chemical/Biotech)',
};

export const COURSE_DATA: CourseData[] = [
  // VIT VELLORE
  {
    id: 'vellore-cse',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering',
    shortName: 'CSE',
    domain: 'computer-science',
    categories: [600, 1450, 7700, 18500, 31500],
    isNewCourse: false,
  },
  {
    id: 'vellore-cse-aiml',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
    shortName: 'CSE (AI & ML)',
    domain: 'computer-science',
    categories: [2000, 3200, 16500, 25500, 34500],
    isNewCourse: false,
  },
  {
    id: 'vellore-cse-aide',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering (Artificial Intelligence and Data Engineering)',
    shortName: 'CSE (AI & Data)',
    domain: 'computer-science',
    categories: [1500, 2800, 14500, 23000, 32000],
    isNewCourse: false,
  },
  {
    id: 'vellore-cse-bioinformatics',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering (Bioinformatics)',
    shortName: 'CSE (Bioinformatics)',
    domain: 'computer-science',
    categories: [8100, 15500, 20000, 30500, 40700],
    isNewCourse: false,
  },
  {
    id: 'vellore-cse-cybersec',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering (Cyber Security)',
    shortName: 'CSE (Cyber Security)',
    domain: 'computer-science',
    categories: [2100, 3400, 17000, 27000, 33500],
    isNewCourse: false,
  },
  {
    id: 'vellore-cse-business',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering and Business Systems (in collaboration with TCS)',
    shortName: 'CSE (Business Systems)',
    domain: 'computer-science',
    categories: [3000, 6700, 18500, 28500, 40500],
    isNewCourse: false,
  },
  {
    id: 'vellore-cse-ds',
    campus: 'vellore',
    course: 'B.Tech. Computer Science and Engineering (Data Science)',
    shortName: 'CSE (Data Science)',
    domain: 'computer-science',
    categories: [1800, 3500, 16000, 29500, 36000],
    isNewCourse: false,
  },
  {
    id: 'vellore-it',
    campus: 'vellore',
    course: 'B.Tech. Information Technology',
    shortName: 'IT',
    domain: 'computer-science',
    categories: [4000, 7500, 17000, 28500, 38100],
    isNewCourse: false,
  },
  {
    id: 'vellore-info-sec',
    campus: 'vellore',
    course: 'B.Tech. Information Security',
    shortName: 'Information Security',
    domain: 'computer-science',
    categories: [2500, 6500, 16750, 28000, 39500],
    isNewCourse: false,
    notes: 'Appears on 2025 cutoff page but not on official 2025 programme list',
  },
  {
    id: 'vellore-ece',
    campus: 'vellore',
    course: 'B.Tech. Electronics and Communication Engineering',
    shortName: 'ECE',
    domain: 'electronics',
    categories: [10500, 19000, 22000, 32000, 41000],
    isNewCourse: false,
  },
  {
    id: 'vellore-eee',
    campus: 'vellore',
    course: 'B.Tech. Electrical and Electronics Engineering',
    shortName: 'EEE',
    domain: 'electronics',
    categories: [22000, 31000, 26500, 41000, 48000],
    isNewCourse: false,
    notes: 'Cat 3 is lower than Cat 2 in public table',
  },
  {
    id: 'vellore-ece-biomed',
    campus: 'vellore',
    course: 'B.Tech. ECE (Biomedical Engineering)',
    shortName: 'Biomedical Eng.',
    domain: 'electronics',
    categories: [12000, 22000, 24000, 38000, 46500],
    isNewCourse: false,
  },
  {
    id: 'vellore-ecm',
    campus: 'vellore',
    course: 'B.Tech. Electronics and Computer Engineering',
    shortName: 'ECE (Computer)',
    domain: 'electronics',
    categories: [14500, 19000, 23500, 32000, 41000],
    isNewCourse: false,
  },
  {
    id: 'vellore-eie',
    campus: 'vellore',
    course: 'B.Tech. Electronics and Instrumentation Engineering',
    shortName: 'EIE',
    domain: 'electronics',
    categories: [23000, 32000, 27500, 42000, 50000],
    isNewCourse: false,
    notes: 'Cat 3 is lower than Cat 2 in public table',
  },
  {
    id: 'vellore-vlsi',
    campus: 'vellore',
    course: 'B.Tech. Electronics Engineering (VLSI Design and Technology)',
    shortName: 'VLSI Design',
    domain: 'electronics',
    categories: [18000, 31000, 36000, 41000, 48000],
    isNewCourse: false,
  },
  {
    id: 'vellore-mech',
    campus: 'vellore',
    course: 'B.Tech. Mechanical Engineering',
    shortName: 'Mechanical',
    domain: 'mechanical',
    categories: [39000, 62120, 68000, 72000, 72000],
    isNewCourse: false,
    notes: 'Cat 5 not exposed publicly for 2025',
  },
  {
    id: 'vellore-mech-ev',
    campus: 'vellore',
    course: 'B.Tech. Mechanical Engineering (Electric Vehicles)',
    shortName: 'Mech (EV)',
    domain: 'mechanical',
    categories: [40000, 65000, 70000, 70000, 70000],
    isNewCourse: false,
    notes: 'Higher categories not exposed publicly',
  },
  {
    id: 'vellore-mech-sm',
    campus: 'vellore',
    course: 'B.Tech. Mechanical Engineering (Smart Manufacturing)',
    shortName: 'Smart Manufacturing',
    domain: 'mechanical',
    categories: [42000, 67000, 67000, 67000, 67000],
    isNewCourse: false,
    notes: 'Higher categories not exposed publicly',
  },
  {
    id: 'vellore-biotech',
    campus: 'vellore',
    course: 'B.Tech. Biotechnology',
    shortName: 'Biotechnology',
    domain: 'core',
    categories: [9500, 16000, 23500, 44000, 51000],
    isNewCourse: false,
  },
  {
    id: 'vellore-chem',
    campus: 'vellore',
    course: 'B.Tech. Chemical Engineering',
    shortName: 'Chemical Eng.',
    domain: 'core',
    categories: [45000, 45000, 45000, 45000, 45000],
    isNewCourse: false,
    notes: 'Only Cat 1 exposed on 2025 page',
  },
  {
    id: 'vellore-civil',
    campus: 'vellore',
    course: 'B.Tech. Civil Engineering',
    shortName: 'Civil Eng.',
    domain: 'core',
    categories: [56500, 56500, 56500, 56500, 56500],
    isNewCourse: false,
    notes: 'Only Cat 1 exposed on 2025 page',
  },
  {
    id: 'vellore-civil-lnt',
    campus: 'vellore',
    course: 'B.Tech. Civil Engineering (in collaboration with L&T)',
    shortName: 'Civil Eng. (L&T)',
    domain: 'core',
    categories: [56500, 56500, 56500, 56500, 56500],
    isNewCourse: true,
    notes: 'Estimated based on Civil Engineering',
  },
  {
    id: 'vellore-hst',
    campus: 'vellore',
    course: 'B.Tech. Health Sciences and Technology',
    shortName: 'Health Sciences',
    domain: 'core',
    categories: [13500, 28000, 37000, 43500, 43500],
    isNewCourse: false,
    notes: 'Cat 5 not exposed publicly for 2025',
  },

  // VIT CHENNAI
  {
    id: 'chennai-cse',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering',
    shortName: 'CSE',
    domain: 'computer-science',
    categories: [3100, 5000, 14000, 25600, 32500],
    isNewCourse: false,
  },
  {
    id: 'chennai-cse-aiml',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
    shortName: 'CSE (AI & ML)',
    domain: 'computer-science',
    categories: [4500, 7700, 18000, 29000, 39000],
    isNewCourse: false,
  },
  {
    id: 'chennai-cse-airobo',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Artificial Intelligence and Robotics)',
    shortName: 'CSE (AI & Robotics)',
    domain: 'computer-science',
    categories: [14500, 19500, 24000, 34500, 45000],
    isNewCourse: false,
  },
  {
    id: 'chennai-cse-cps',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Cyber Physical Systems)',
    shortName: 'CSE (Cyber Physical)',
    domain: 'computer-science',
    categories: [12500, 17500, 23500, 32500, 44000],
    isNewCourse: false,
  },
  {
    id: 'chennai-cse-cybersec',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Cyber Security)',
    shortName: 'CSE (Cyber Security)',
    domain: 'computer-science',
    categories: [10500, 19000, 22000, 32000, 41000],
    isNewCourse: false,
  },
  {
    id: 'chennai-cse-ds',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Data Science)',
    shortName: 'CSE (Data Science)',
    domain: 'computer-science',
    categories: [8200, 16000, 20500, 30000, 42500],
    isNewCourse: false,
  },
  {
    id: 'chennai-cse-quantum',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Quantum Computing)',
    shortName: 'CSE (Quantum)',
    domain: 'computer-science',
    categories: [10000, 18000, 22000, 35000, 45000],
    isNewCourse: true,
    notes: 'Estimated based on CSE Data Science avg',
  },
  {
    id: 'chennai-cse-deakin',
    campus: 'chennai',
    course: 'B.Tech. Computer Science and Engineering (Cyber Security) (2+2 Dual Degree with Deakin University)',
    shortName: 'CSE (Cyber Sec) 2+2',
    domain: 'computer-science',
    categories: [10500, 19000, 22000, 32000, 41000],
    isNewCourse: true,
    notes: 'Estimated based on CSE Cyber Security',
  },
  {
    id: 'chennai-ece',
    campus: 'chennai',
    course: 'B.Tech. Electronics and Communication Engineering',
    shortName: 'ECE',
    domain: 'electronics',
    categories: [21000, 38000, 41000, 47000, 51000],
    isNewCourse: false,
  },
  {
    id: 'chennai-ecm',
    campus: 'chennai',
    course: 'B.Tech. Electronics and Computer Engineering',
    shortName: 'ECE (Computer)',
    domain: 'electronics',
    categories: [16500, 32000, 43000, 49000, 57000],
    isNewCourse: false,
  },
  {
    id: 'chennai-eee',
    campus: 'chennai',
    course: 'B.Tech. Electrical and Electronics Engineering',
    shortName: 'EEE',
    domain: 'electronics',
    categories: [38000, 46000, 58000, 64000, 65500],
    isNewCourse: false,
  },
  {
    id: 'chennai-ecse',
    campus: 'chennai',
    course: 'B.Tech. Electrical and Computer Science Engineering',
    shortName: 'ECSE',
    domain: 'electronics',
    categories: [34400, 43000, 51000, 59000, 60000],
    isNewCourse: false,
  },
  {
    id: 'chennai-vlsi',
    campus: 'chennai',
    course: 'B.Tech. Electronics Engineering (VLSI Design and Technology)',
    shortName: 'VLSI Design',
    domain: 'electronics',
    categories: [29000, 41000, 44000, 46000, 58000],
    isNewCourse: false,
  },
  {
    id: 'chennai-mech',
    campus: 'chennai',
    course: 'B.Tech. Mechanical Engineering',
    shortName: 'Mechanical',
    domain: 'mechanical',
    categories: [79000, 85000, 90000, 93000, 94500],
    isNewCourse: false,
  },
  {
    id: 'chennai-mech-ev',
    campus: 'chennai',
    course: 'B.Tech. Mechanical Engineering (Electric Vehicles)',
    shortName: 'Mech (EV)',
    domain: 'mechanical',
    categories: [84000, 89000, 92500, 94500, 95700],
    isNewCourse: false,
  },
  {
    id: 'chennai-mechatronics',
    campus: 'chennai',
    course: 'B.Tech. Mechatronics and Automation',
    shortName: 'Mechatronics',
    domain: 'mechanical',
    categories: [82500, 88000, 92000, 94000, 95500],
    isNewCourse: false,
  },
  {
    id: 'chennai-civil',
    campus: 'chennai',
    course: 'B.Tech. Civil Engineering',
    shortName: 'Civil Eng.',
    domain: 'core',
    categories: [84000, 90000, 94000, 97000, 98500],
    isNewCourse: false,
  },
  {
    id: 'chennai-civil-lnt',
    campus: 'chennai',
    course: 'B.Tech. Civil Engineering (in collaboration with L&T)',
    shortName: 'Civil Eng. (L&T)',
    domain: 'core',
    categories: [84000, 90000, 94000, 97000, 98500],
    isNewCourse: true,
    notes: 'Estimated based on Civil Engineering',
  },
  {
    id: 'chennai-biotech',
    campus: 'chennai',
    course: 'B.Tech. Biotechnology',
    shortName: 'Biotechnology',
    domain: 'core',
    categories: [81000, 86000, 91000, 95000, 96500],
    isNewCourse: false,
  },
  {
    id: 'chennai-fashion',
    campus: 'chennai',
    course: 'B.Tech. Fashion Technology',
    shortName: 'Fashion Tech',
    domain: 'core',
    categories: [81000, 86000, 91000, 95000, 96500],
    isNewCourse: false,
  },

  // VIT AP
  {
    id: 'ap-cse',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Engineering',
    shortName: 'CSE',
    domain: 'computer-science',
    categories: [28000, 42000, 60000, 80000, 105000],
    isNewCourse: false,
  },
  {
    id: 'ap-cse-aiml',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
    shortName: 'CSE (AI & ML)',
    domain: 'computer-science',
    categories: [30000, 45000, 64000, 84000, 110000],
    isNewCourse: false,
  },
  {
    id: 'ap-cse-blockchain',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Engineering (Blockchain)',
    shortName: 'CSE (Blockchain)',
    domain: 'computer-science',
    categories: [40000, 58000, 78000, 98000, 128000],
    isNewCourse: false,
  },
  {
    id: 'ap-cse-cybersec',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Engineering (Cyber Security)',
    shortName: 'CSE (Cyber Security)',
    domain: 'computer-science',
    categories: [34000, 50000, 70000, 90000, 118000],
    isNewCourse: false,
  },
  {
    id: 'ap-cse-data',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Engineering (Data Analytics)',
    shortName: 'CSE (Data Analytics)',
    domain: 'computer-science',
    categories: [32000, 48000, 68000, 88000, 115000],
    isNewCourse: false,
  },
  {
    id: 'ap-cse-software',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Engineering (Software Engineering)',
    shortName: 'CSE (Software)',
    domain: 'computer-science',
    categories: [36000, 52000, 72000, 92000, 120000],
    isNewCourse: false,
  },
  {
    id: 'ap-cse-business',
    campus: 'ap',
    course: 'B.Tech. Computer Science and Business Systems',
    shortName: 'CSE (Business)',
    domain: 'computer-science',
    categories: [38000, 55000, 75000, 95000, 125000],
    isNewCourse: false,
  },
  {
    id: 'ap-ece',
    campus: 'ap',
    course: 'B.Tech. Electronics and Communication Engineering',
    shortName: 'ECE',
    domain: 'electronics',
    categories: [50000, 70000, 90000, 115000, 140000],
    isNewCourse: false,
  },
  {
    id: 'ap-ece-embedded',
    campus: 'ap',
    course: 'B.Tech. Electronics and Communication Engineering (Embedded Systems)',
    shortName: 'ECE (Embedded)',
    domain: 'electronics',
    categories: [58000, 78000, 98000, 122000, 148000],
    isNewCourse: false,
  },
  {
    id: 'ap-ece-vlsi',
    campus: 'ap',
    course: 'B.Tech. Electronics and Communication Engineering (VLSI)',
    shortName: 'ECE (VLSI)',
    domain: 'electronics',
    categories: [55000, 75000, 95000, 120000, 145000],
    isNewCourse: false,
  },
  {
    id: 'ap-ecm',
    campus: 'ap',
    course: 'B.Tech. Electronics and Computer Engineering',
    shortName: 'ECE (Computer)',
    domain: 'electronics',
    categories: [55000, 75000, 95000, 120000, 145000],
    isNewCourse: false,
  },
  {
    id: 'ap-eee',
    campus: 'ap',
    course: 'B.Tech. Electrical and Electronics Engineering',
    shortName: 'EEE',
    domain: 'electronics',
    categories: [55000, 75000, 95000, 120000, 145000],
    isNewCourse: false,
  },
  {
    id: 'ap-mech',
    campus: 'ap',
    course: 'B.Tech. Mechanical Engineering',
    shortName: 'Mechanical',
    domain: 'mechanical',
    categories: [70000, 90000, 110000, 135000, 150000],
    isNewCourse: false,
  },
  {
    id: 'ap-mech-auto',
    campus: 'ap',
    course: 'B.Tech. Mechanical Engineering (Automotive Design)',
    shortName: 'Mech (Auto)',
    domain: 'mechanical',
    categories: [68000, 88000, 108000, 130000, 150000],
    isNewCourse: false,
  },
  {
    id: 'ap-mech-robo',
    campus: 'ap',
    course: 'B.Tech. Mechanical Engineering (Robotics)',
    shortName: 'Mech (Robotics)',
    domain: 'mechanical',
    categories: [62000, 82000, 102000, 125000, 150000],
    isNewCourse: false,
  },
  {
    id: 'ap-biotech',
    campus: 'ap',
    course: 'B.Tech. Biotechnology',
    shortName: 'Biotechnology',
    domain: 'core',
    categories: [70000, 90000, 110000, 135000, 150000],
    isNewCourse: false,
  },

  // VIT BHOPAL
  {
    id: 'bhopal-cse',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering',
    shortName: 'CSE',
    domain: 'computer-science',
    categories: [30000, 45000, 65000, 85000, 110000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-aiml',
    campus: 'bhopal',
    course: 'B.Tech - Computer Science & Engineering (Artificial Intelligence & Machine Learning)',
    shortName: 'CSE (AI & ML)',
    domain: 'computer-science',
    categories: [33000, 50000, 70000, 90000, 118000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-cloud',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering (Cloud Computing & Automation)',
    shortName: 'CSE (Cloud)',
    domain: 'computer-science',
    categories: [38000, 55000, 78000, 98000, 125000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-cybersec',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering (Cyber Security & Digital Forensics)',
    shortName: 'CSE (Cyber Sec)',
    domain: 'computer-science',
    categories: [35000, 52000, 75000, 95000, 120000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-ecom',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering (E-Commerce Technology)',
    shortName: 'CSE (E-Commerce)',
    domain: 'computer-science',
    categories: [45000, 65000, 88000, 110000, 135000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-edutech',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering (Education Technology)',
    shortName: 'CSE (Edu Tech)',
    domain: 'computer-science',
    categories: [48000, 68000, 90000, 115000, 140000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-gaming',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering (Gaming Technology)',
    shortName: 'CSE (Gaming)',
    domain: 'computer-science',
    categories: [40000, 58000, 82000, 100000, 128000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-cse-health',
    campus: 'bhopal',
    course: 'B.Tech. Computer Science & Engineering (Health Informatics)',
    shortName: 'CSE (Health)',
    domain: 'computer-science',
    categories: [42000, 60000, 85000, 105000, 130000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-ai',
    campus: 'bhopal',
    course: 'B.Tech. Artificial Intelligence',
    shortName: 'AI',
    domain: 'computer-science',
    categories: [32000, 48000, 68000, 88000, 115000],
    isNewCourse: false,
    notes: 'Appears on 2025 cutoff page but not on official 2025 programme list',
  },
  {
    id: 'bhopal-ece',
    campus: 'bhopal',
    course: 'B.Tech. Electronics & Communication Engineering',
    shortName: 'ECE',
    domain: 'electronics',
    categories: [55000, 75000, 95000, 120000, 145000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-ece-aic',
    campus: 'bhopal',
    course: 'B.Tech. Electronics & Communication Engineering (Artificial Intelligence & Cybernetics)',
    shortName: 'ECE (AI & Cybernetics)',
    domain: 'electronics',
    categories: [55000, 75000, 95000, 120000, 145000],
    isNewCourse: true,
    notes: 'Estimated based on ECE avg',
  },
  {
    id: 'bhopal-aerospace',
    campus: 'bhopal',
    course: 'B.Tech. Aerospace Engineering',
    shortName: 'Aerospace',
    domain: 'mechanical',
    categories: [60000, 80000, 100000, 125000, 150000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-bioeng',
    campus: 'bhopal',
    course: 'B.Tech. Bioengineering',
    shortName: 'Bioengineering',
    domain: 'core',
    categories: [70000, 90000, 110000, 135000, 150000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-mech',
    campus: 'bhopal',
    course: 'B.Tech. Mechanical Engineering',
    shortName: 'Mechanical',
    domain: 'mechanical',
    categories: [75000, 95000, 115000, 140000, 150000],
    isNewCourse: false,
  },
  {
    id: 'bhopal-mech-airobo',
    campus: 'bhopal',
    course: 'B.Tech. Mechanical Engineering (Artificial Intelligence & Robotics)',
    shortName: 'Mech (AI & Robotics)',
    domain: 'mechanical',
    categories: [65000, 85000, 105000, 130000, 150000],
    isNewCourse: false,
  },
];

export const MARKS_TO_RANK: { minMarks: number; maxMarks: number; minRank: number; maxRank: number; confidence: string }[] = [
  { minMarks: 118, maxMarks: 125, minRank: 1, maxRank: 250, confidence: 'High' },
  { minMarks: 113, maxMarks: 117, minRank: 251, maxRank: 500, confidence: 'High' },
  { minMarks: 90, maxMarks: 112, minRank: 501, maxRank: 2500, confidence: 'High' },
  { minMarks: 81, maxMarks: 89, minRank: 2501, maxRank: 5000, confidence: 'High' },
  { minMarks: 72, maxMarks: 80, minRank: 5001, maxRank: 6500, confidence: 'High' },
  { minMarks: 60, maxMarks: 71, minRank: 6501, maxRank: 8500, confidence: 'High' },
  { minMarks: 43, maxMarks: 59, minRank: 8501, maxRank: 11000, confidence: 'High' },
  { minMarks: 31, maxMarks: 42, minRank: 14001, maxRank: 20000, confidence: 'Medium-Low' },
  { minMarks: 0, maxMarks: 30, minRank: 20001, maxRank: 200000, confidence: 'Medium' },
];

export function getEligibleCampuses(rank: number): Campus[] {
  if (rank <= 100000) {
    return ['vellore', 'chennai', 'ap', 'bhopal'];
  }
  return ['ap', 'bhopal'];
}

export function getCoursesInRankRange(
  rank: number,
  reachWindow: number = 2500,
  options?: {
    domain?: Domain;
    domains?: Domain[];
    category?: number;
    minCategory?: number;
    campuses?: Campus[];
  }
): Array<{
  course: CourseData;
  category: number;
  withinRange: boolean;
  closingRank: number;
  secured: boolean;
}> {
  const eligibleCampuses = getEligibleCampuses(rank);
  const campuses = options?.campuses?.filter(c => eligibleCampuses.includes(c)) || eligibleCampuses;
  const domains = options?.domains && options.domains.length > 0
    ? options.domains
    : (options?.domain ? [options.domain] : null);
  const minCat = options?.minCategory ?? options?.category ?? 1;

  const results: Array<{
    course: CourseData;
    category: number;
    withinRange: boolean;
    closingRank: number;
    secured: boolean;
  }> = [];

  // Reachable means the user is within `reachWindow` ranks of, or better than, the cutoff.
  //   rank <= closingRank                 -> secured (always include — no upper bound)
  //   closingRank < rank <= closingRank+W -> reach
  //   rank > closingRank + reachWindow    -> out of reach (skip)
  const reachThreshold = Math.max(1, rank - reachWindow);

  for (const course of COURSE_DATA) {
    if (!campuses.includes(course.campus)) continue;
    if (domains && !domains.includes(course.domain)) continue;

    for (let cat = minCat; cat <= 5; cat++) {
      const closingRank = course.categories[cat - 1];
      if (closingRank < reachThreshold) continue;

      results.push({
        course,
        category: cat,
        withinRange: true,
        closingRank,
        secured: rank <= closingRank,
      });
    }
  }

  return results.sort((a, b) => a.closingRank - b.closingRank);
}

export function getMarksFromRank(rank: number): { minMarks: number; maxMarks: number; confidence: string } | null {
  for (const range of MARKS_TO_RANK) {
    if (rank >= range.minRank && rank <= range.maxRank) {
      return {
        minMarks: range.minMarks,
        maxMarks: range.maxMarks,
        confidence: range.confidence,
      };
    }
  }
  return null;
}

export function getCoursesByDomain(domain: Domain, campuses?: Campus[]): CourseData[] {
  return COURSE_DATA.filter(course => {
    if (domain && course.domain !== domain) return false;
    if (campuses && campuses.length > 0 && !campuses.includes(course.campus)) return false;
    return true;
  });
}

export const ALL_DOMAINS: Domain[] = ['computer-science', 'electronics', 'mechanical', 'core'];
export const ALL_CAMPUSES: Campus[] = ['vellore', 'chennai', 'ap', 'bhopal'];
export const ALL_CATEGORIES = [1, 2, 3, 4, 5];