import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class" // sets dark/light mode via `class`
      defaultTheme="system" // can be "light", "dark", or "system"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
