// hero.ts
import { heroui } from '@heroui/theme';

// Exportamos el plugin de Hero UI con la configuración de temas personalizada
export default heroui({
    themes: {
        brand: {
            colors: {
                // Paleta principal (rojo institucional #990000)
                primary: {
                    50: '#FFECEC',
                    100: '#FFD2D2',
                    200: '#FFB3B3',
                    300: '#FF8A8A',
                    400: '#F25C5C',
                    500: '#990000', // base
                    600: '#7F0000',
                    700: '#660000',
                    800: '#4D0000',
                    900: '#330000',
                    foreground: '#FFFFFF',
                    DEFAULT: '#990000',
                },
                default: {
                    // Neutral base para superficies
                    50: '#F8F9FA',
                    100: '#F1F3F5',
                    200: '#E9ECEF',
                    300: '#DEE2E6',
                    400: '#CED4DA',
                    500: '#ADB5BD',
                    600: '#868E96',
                    700: '#495057',
                    800: '#343A40',
                    900: '#212529',
                    foreground: '#212529',
                    DEFAULT: '#ADB5BD',
                },
                secondary: {
                    // Usamos dorado/ámbar para acentos corporativos secundarios
                    50: '#FFF7E6',
                    100: '#FEEBC7',
                    200: '#FDD996',
                    300: '#FAC161',
                    400: '#F2A630',
                    500: '#C4841D', // Advertencias manual
                    600: '#9E6815',
                    700: '#774C0E',
                    800: '#513108',
                    900: '#2B1903',
                    foreground: '#1A1004',
                    DEFAULT: '#C4841D',
                },
                success: {
                    // Basado en #17C964
                    50: '#E8FAF0', // informativa éxito fondo
                    100: '#D1F5E0',
                    200: '#A4EBBF',
                    300: '#76E09F',
                    400: '#49D67F',
                    500: '#17C964',
                    600: '#12A250',
                    700: '#0E7B3C',
                    800: '#095428',
                    900: '#052E15',
                    foreground: '#052E15',
                    DEFAULT: '#17C964',
                },
                warning: {
                    // Advertencias (mismo color para fondo/texto según manual, damos escala)
                    50: '#FFF4E6',
                    100: '#FDE5C7',
                    200: '#FBD197',
                    300: '#F7B862',
                    400: '#F2A630',
                    500: '#C4841D',
                    600: '#9E6815',
                    700: '#774C0E',
                    800: '#513108',
                    900: '#2B1903',
                    foreground: '#2B1903',
                    DEFAULT: '#C4841D',
                },
                danger: {
                    // Error principal #F31260
                    50: '#FEE7EF', // fondo alertas error
                    100: '#FCCFDF',
                    200: '#F9A0C0',
                    300: '#F671A1',
                    400: '#F34181',
                    500: '#F31260',
                    600: '#C90E4D',
                    700: '#9F0B3D',
                    800: '#75082D',
                    900: '#4B051D',
                    foreground: '#4B051D',
                    DEFAULT: '#F31260',
                },
                background: '#FFFFFF',
                foreground: '#212529',
                content1: { DEFAULT: '#FFFFFF', foreground: '#212529' },
                content2: { DEFAULT: '#F8F9FA', foreground: '#212529' },
                content3: { DEFAULT: '#F1F3F5', foreground: '#212529' },
                content4: { DEFAULT: '#E9ECEF', foreground: '#212529' },
                focus: '#006FEE',
                overlay: '#000000',
                divider: '#DEE2E6',
            },
        },
    },
});
