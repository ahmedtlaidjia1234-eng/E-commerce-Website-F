import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { applyThemeToDOM, themeColors } = useStore();
  
  useEffect(() => {
    // Apply theme colors on mount and whenever they change
    applyThemeToDOM();
  }, [applyThemeToDOM, themeColors]);
  
  return <>{children}</>;
}