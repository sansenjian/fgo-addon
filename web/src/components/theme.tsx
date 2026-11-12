import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function useTheme() {
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="rounded-md border border-border p-2 text-muted transition-colors hover:text-foreground"
      title="切换亮/暗主题"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
