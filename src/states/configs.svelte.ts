export const themeMode = (() => {
  let mode = $state("dark");

  return {
    get value() {
      return mode
    },
    toggle() {
      mode = mode === "dark" ? "light" : "dark"
    },
    set(theme: "light" | "dark") {
      mode = theme
    }
  }
})();
