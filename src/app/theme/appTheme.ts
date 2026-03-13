import { createTheme } from "@mui/material/styles";

// English notes: keep theme centralized for consistent ERP UI.
export const appTheme = createTheme({
    palette: {
        mode: "dark"
    },
    typography: {
        fontFamily: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(",")
    }
});