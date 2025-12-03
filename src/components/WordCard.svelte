<script lang="ts">
  import { db } from "@/db/client";
  import { Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { appText, selectedItem } from "@/states";
  import type { Word } from "@/type";

  let {
    word: w,
  }: {
    word: Word;
  } = $props();

  let updatedWord: Word | null = $state(null);
</script>

<div class="w-full flex justify-center">
  <button
    class={cn(
      "w-[80vw] h-30! flex flex-col gap-2 border-2 border-pink-900 hover:bg-pink-800 text-primary hover:text-primary/90 mb-1 overflow-hidden",
      "flex flex-col items-center transition-all duration-300 select-none rounded-sm",
      selectedItem.matchWord(w.mainWriting) && "bg-pink-500",
    )}
    onclick={async () => {
      if (!updatedWord) {
        selectedItem.value =
          (await db.query.words.findFirst({
            with: { saved: true, translations: true },
            where: (words, { eq }) => eq(words.mainWriting, w.mainWriting),
          })) || null;
      } else {
        selectedItem.value = updatedWord;
      }
      updatedWord = null;
    }}
    onmouseenter={async () => {
      updatedWord =
        (await db.query.words.findFirst({
          with: { saved: true, translations: true },
          where: (words, { eq }) => eq(words.mainWriting, w.mainWriting),
        })) || null;
    }}
    onmouseleave={() => {
      updatedWord = null;
    }}
  >
    <div class="w-full h-full flex items-center">
      <div
        class="w-6/8 h-full flex flex-col justify-center items-center [&>*]:cursor-pointer"
      >
        <Label class="text-xl kanji-font">
          {w.mainReading}
        </Label>
        <Label class="text-4xl kanji-font">
          {w.mainWriting}
        </Label>
        <Label class="break-all">
          {w.translations.find(t => t.language === appText.language)
            ?.mainMeaning ?? w.translations?.[0]?.mainMeaning}
        </Label>
      </div>
      <p class="w-2/8 text-2xl font-medium kanji-font">
        {w.mainKanjis}
      </p>
    </div>
  </button>
</div>
