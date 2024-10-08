/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#0077B6",
                secondary: "#00B4D8",
                tertiary: "#90E0EF",
                accent: "#CAF0F8",
            },
        },
    },
    plugins: [],
};
