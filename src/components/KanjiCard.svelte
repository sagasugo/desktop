<script lang="ts">
  import { cn } from "@/lib/utils";
  import { selectedKanji } from "@/states";
  import type { Kanji } from "@/type";

  let {
    kanji: k,
  }: {
    kanji: Kanji;
  } = $props();
</script>

<button
  class={cn(
    "btn preset-outlined-tertiary-500 hover:preset-filled-tertiary-500 text-primary flex flex-col py-6 transition-all duration-300 select-none rounded-sm",
    selectedKanji.k?.kanji === k.kanji && "preset-filled-tertiary-500",
  )}
  onclick={() => {
    selectedKanji.k =
      selectedKanji.k === null || selectedKanji.k.kanji !== k.kanji ? k : null;
  }}
>
  <span class="text-3xl">
    {k.kanji}
  </span>
</button>
