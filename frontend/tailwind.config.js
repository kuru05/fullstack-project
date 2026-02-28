export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                tactical: {
                    50: '#f8f6f0',
                    100: '#ece8db',
                    200: '#d9d0b8',
                    300: '#c2b48e',
                    400: '#ad9a6c',
                    500: '#9a8558',
                    600: '#846d4a',
                    700: '#6b563e',
                    800: '#5a4837',
                    900: '#4d3e31',
                    950: '#2b2019',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
