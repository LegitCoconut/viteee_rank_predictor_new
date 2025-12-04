export interface Campus {
    id: string;
    name: string;
    description: string;
    website: string;
    imageId: string;
    redditUrl: string;
}

export const campuses: Campus[] = [
    {
        id: 'vellore',
        name: 'VIT Vellore',
        description: 'Located in Vellore, Tamil Nadu and founded in 1984, this is the original VIT campus offering a wide range of UG/PG/research programmes under a fully-flexible credit system.',
        website: 'https://vit.ac.in/',
        imageId: 'vit-vellore',
        redditUrl: 'https://www.reddit.com/r/Vit/',
    },
    {
        id: 'chennai',
        name: 'VIT Chennai',
        description: 'Established in 2010 in Chennai, Tamil Nadu, this campus emphasises research engagement and global exposure, offering engineering, science, business and doctoral programmes.',
        website: 'https://chennai.vit.ac.in/',
        imageId: 'vit-chennai',
        redditUrl: 'https://www.reddit.com/r/vitchennai/',
    },
    {
        id: 'ap',
        name: 'VIT-AP',
        description: 'Founded in 2017 near Amaravati, this state-private university by VIT offers engineering, science, business, law and humanities with novel features like “Design Your Own Degree” and international transfer programmes.',
        website: 'https://vitap.ac.in/',
        imageId: 'vit-ap',
        redditUrl: 'https://www.reddit.com/r/vitap/',
    },
    {
        id: 'bhopal',
        name: 'VIT Bhopal',
        description: 'Located in Kothri Kalan, Sehore district (near Bhopal), Madhya Pradesh and established in 2017, this campus is part of the VIT group focusing on technical and professional education for central India.',
        website: 'https://vitbhopal.ac.in/',
        imageId: 'vit-bhopal',
        redditUrl: 'https://www.reddit.com/r/vitbhopal/',
    },
];
