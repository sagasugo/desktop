<script lang="ts">
  import { Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { selectedWord } from "@/states";
  import type { Word } from "@/type";

  let {
    word: w,
  }: {
    word: Word;
  } = $props();
</script>

<div class="w-full flex justify-center">
  <button
    class={cn(
      "btn w-[80vw] preset-outlined-tertiary-500 hover:preset-filled-tertiary-500 text-primary",
      "flex flex-col items-center transition-all duration-300 select-none rounded-sm [&>*]:cursor-pointer",
      selectedWord.w?.mainWriting === w.mainWriting &&
        "preset-filled-tertiary-500",
    )}
    onclick={() => {
      selectedWord.w =
        selectedWord.w === null || selectedWord.w.mainWriting !== w.mainWriting
          ? w
          : null;
    }}
  >
    <Label class="text-xl">
      {w.mainWriting}
      |
      {w.mainReading}
      |
      {w.translations?.[0]?.mainMeaning}
      |
      {w.mainKanjis}
    </Label>
  </button>
</div>
