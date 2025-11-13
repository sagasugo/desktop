<script lang="ts">
  import { cn } from "@/lib/utils";
  import { kanjiShowed } from "@/states";
  import type { Kanji } from "@/type";

  let {
    kanji,
  }: {
    kanji: Kanji;
  } = $props();
</script>

<button
  class={cn(
    "btn preset-outlined-surface-500 hover:preset-filled-surface-500 text-primary flex flex-col py-6 transition-all duration-300 select-none rounded-sm",
    kanjiShowed.value?.kanji === kanji.kanji && "preset-filled-surface-500",
  )}
  onclick={() => {
    kanjiShowed.value =
      kanjiShowed.value === null || kanjiShowed.value.kanji !== kanji.kanji
        ? kanji
        : null;
  }}
>
  <span class="text-3xl">
    {kanji.kanji}
  </span>
</button>
