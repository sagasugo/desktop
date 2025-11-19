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
      "btn w-[80vw] h-30 preset-outlined-tertiary-500 hover:preset-filled-tertiary-500 text-primary hover:text-primary/90 mb-1 overflow-hidden",
      "flex flex-col items-center transition-all duration-300 select-none rounded-sm",
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
    <div class="w-full h-full flex items-center">
      <div
        class="w-6/8 h-full flex flex-col justify-center items-center [&>*]:cursor-pointer"
      >
        <Label class="text-xl">
          {w.mainReading}
        </Label>
        <Label class="text-4xl">
          {w.mainWriting}
        </Label>
        <Label class="break-all">
          {w.translations?.[0]?.mainMeaning}
        </Label>
      </div>
      <p class="w-2/8 text-2xl font-medium">
        {w.mainKanjis}
      </p>
    </div>
  </button>
</div>
