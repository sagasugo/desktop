<script lang="ts">
  import { cn } from "@/lib/utils";
  import { kanjiShowed } from "@/states";

  let {
    kanji,
  }: {
    kanji: {
      radical: string;
      furigana: string;
      meaning: string[];
      jlpt: string;
      readings: string[];
      phrases: string[];
    };
  } = $props();
</script>

<button
  class={cn(
    "btn preset-outlined-surface-500 hover:preset-filled-surface-500 text-primary flex flex-col py-6 transition-all duration-300 select-none rounded-sm",
    kanjiShowed.value?.radical === kanji.radical && "preset-filled-surface-500",
  )}
  onclick={() => {
    kanjiShowed.value =
      kanjiShowed.value === null || kanjiShowed.value.radical !== kanji.radical
        ? kanji
        : null;
  }}
>
  <span class="text-3xl">
    {kanji.radical}
  </span>
</button>
