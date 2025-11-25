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
  }

}

export const speech = new class {
  isJPAvailable = $state(false)

  constructor() {
    window.speechSynthesis.onvoiceschanged = () => this.checkAvailable()
  }

  speak(text: string | null | undefined) {
    if (!text || !this.checkAvailable()) return;
    const toSpeak = new window.SpeechSynthesisUtterance();
    toSpeak.lang = "ja-JP";
    toSpeak.text = text
    window.speechSynthesis.speak(toSpeak);
  }

  checkAvailable(): boolean {
    const reco = window.speechSynthesis;
    for (let voice of reco.getVoices()) {
      if (voice.lang === "ja-JP") {
        this.isJPAvailable = true
        return true;
      }
    }
    this.isJPAvailable = false
    return false
  }
}
