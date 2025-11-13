// frontend/tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // palette EcoTrack (optionnel)
            colors: {
                brand: {
                    50:  "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    500: "#10b981", // vert principal
                    600: "#059669",
                    700: "#047857",
                },
            },
            fontFamily: {
                // si tu utilises Inter via index.html
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            },
            container: {
                center: true,
                padding: "1rem",
            },
        },
    },
    darkMode: "class",   // optionnel
    plugins: [],
};
