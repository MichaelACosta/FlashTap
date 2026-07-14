import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  mode: "light" | "dark";
  onClick: () => void;
};

export function ThemeToggle({ mode, onClick }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onClick}
      aria-label={mode === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {mode === "dark" ? "☀" : "☾"}
    </button>
  );
}
