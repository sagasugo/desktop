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

export const appFont = new class {
  #value = $state(0)
  #fonts = [
    "Noto Sans JP",
    "Klee One",
    "Yuji Mai",
    "Noto Serif JP",
    "DotGothic16",
    "Reggae One",
    "Kiwi Maru",
  ];
  font = $derived(this.#fonts[this.#value])

  nextFont() {
    if (this.#value === this.#fonts.length - 1) {
      this.#value = 0
    } else {
      this.#value++
    }

    console.log(this.font)
  }

}
