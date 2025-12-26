// Service to fetch museum data
// In a real scenario, this would hit https://api.dane.gov.pl/1.4/datasets/4306/resources/...
// Due to XLS-only availability of the main registry, we mock the structured response here.
// DATA SOURCE: Local research for Poznań free admission days (2024/2025).

export interface Museum {
    id: string;
    name: string;
    city: string;
    address: string;
    website: string;
    freeDay: string; // The "Golden Feature" for seniors
    imageUrl?: string;
}

const MOCK_MUSEUMS: Museum[] = [
    {
        id: '1',
        name: 'Muzeum Narodowe w Poznaniu',
        city: 'Poznań',
        address: 'Aleje Marcinkowskiego 9',
        website: 'https://mnp.art.pl/',
        freeDay: 'Wtorek',
        imageUrl: 'https://mnp.art.pl/wp-content/uploads/2021/04/mnp_fasada_fot_k_k_k_k_01.jpg'
    },
    {
        id: '2',
        name: 'Muzeum Archeologiczne (Pałac Górków)',
        city: 'Poznań',
        address: 'ul. Wodna 27',
        website: 'https://muzarp.poznan.pl/',
        freeDay: 'Sobota',
        imageUrl: 'https://muzarp.poznan.pl/wp-content/uploads/2019/01/palac-gorkow-1.jpg'
    },
    {
        id: '3',
        name: 'Muzeum Historii Miasta Poznania (Ratusz)',
        city: 'Poznań',
        address: 'Stary Rynek 1',
        website: 'https://mnp.art.pl/oddzialy/ratusz-muzeum-poznania/',
        freeDay: 'Sobota',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Poznan_Ratusz_01.jpg/1200px-Poznan_Ratusz_01.jpg'
    },
    {
        id: '4',
        name: 'Muzeum Powstania Wielkopolskiego 1918-1919 (Odwach)',
        city: 'Poznań',
        address: 'Stary Rynek 3',
        website: 'https://www.wmn.poznan.pl/',
        freeDay: 'Wtorek',
        imageUrl: 'https://www.wmn.poznan.pl/wp-content/uploads/2018/12/odwach-2-1024x680.jpg'
    },
    {
        id: '5',
        name: 'Muzeum Sztuk Użytkowych (Zamek Królewski)',
        city: 'Poznań',
        address: 'Góra Przemysła 1',
        website: 'https://mnp.art.pl/oddzialy/muzeum-sztuk-uzytkowych/',
        freeDay: 'Wtorek',
        imageUrl: 'https://mnp.art.pl/wp-content/uploads/2021/04/msu_zamek_01.jpg'
    },
    {
        id: '6',
        name: 'Rezerwat Archeologiczny Genius Loci',
        city: 'Poznań',
        address: 'ul. Ks. I. Posadzego 3',
        website: 'https://rezerwat.muzarp.poznan.pl/',
        freeDay: 'Niedziela',
        imageUrl: 'https://rezerwat.muzarp.poznan.pl/wp-content/uploads/2018/06/rezerwat-genius-loci.jpg'
    },
    {
        id: '7',
        name: 'Rogalowe Muzeum Poznania',
        city: 'Poznań',
        address: 'Stary Rynek 41',
        website: 'https://rogalowemuzeum.pl/',
        freeDay: 'Brak (Płatne)',
        imageUrl: 'https://rogalowemuzeum.pl/wp-content/uploads/2018/04/rogalowe-muzeum-poznan-1.jpg'
    },
    {
        id: '8',
        name: 'Brama Poznania ICHOT',
        city: 'Poznań',
        address: 'ul. Gdańska 2',
        website: 'https://bramapoznania.pl/',
        freeDay: 'Brak (Bilety ulgowe dla seniorów)',
        imageUrl: 'https://bramapoznania.pl/assets/images/brama-poznania-budynek.jpg'
    }
];

export async function fetchMuseums(): Promise<Museum[]> {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_MUSEUMS);
        }, 600);
    });
}
