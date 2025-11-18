<script lang="ts">
  import { Label } from "@/lib/components";
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
    "btn w-[90px] min-w-[90px] preset-outlined-tertiary-500 hover:preset-filled-tertiary-500 text-primary",
    "flex flex-col items-center py-6 transition-all duration-300 select-none rounded-sm [&>*]:cursor-pointer",
    selectedKanji.k?.kanji === k.kanji && "preset-filled-tertiary-500",
  )}
  onclick={() => {
    selectedKanji.k =
      selectedKanji.k === null || selectedKanji.k.kanji !== k.kanji ? k : null;
  }}
>
  <Label
    class="w-full overflow-hidden flex justify-center break-all wrap-break-word"
  >
    {k.meanings?.[0]?.keyword?.trim()}
  </Label>
  <Label class="text-3xl">
    {k.kanji}
  </Label>
  <Label>
    {k.mainOnReading ?? k.mainKunReading}
  </Label>
</button>
