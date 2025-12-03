<script lang="ts">
  import { KanjiCard, WordCard } from "@/components";
  import { Badge, Button, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { appText, savedPage } from "@/states";
  import { VList } from "virtua/svelte";
  import type { Kanji, Word } from "@/type";
  import { onMount } from "svelte";

  let kanjiDivSize = $state(0);
  let rowedKanjis: Kanji[][] = $derived.by(() => {
    if (!kanjiDivSize || kanjiDivSize < 107) return [savedPage.kanjis];
    const itemsPerRow = Math.floor(kanjiDivSize / 107);
    return savedPage.kanjis.reduce((acc: Kanji[][], _, i) => {
      if (i % itemsPerRow === 0)
        acc.push(savedPage.kanjis.slice(i, i + itemsPerRow));
      return acc;
    }, []);
  });

  onMount(() => {
    savedPage.refreshKanjis();
    savedPage.refreshWords();
  });
</script>

<div class="w-full flex flex-col items-center gap-2">
  <div class="flex flex-col-reverse md:flex-row items-center gap-2">
    <div
      class="flex gap-1 p-1 rounded-2xl relative select-none bg-secondary/50 font-medium [&>*]:w-24 [&>*]:rounded-xl [&_label]:z-10 [&_*]:cursor-pointer"
    >
      <Button
        class={cn(
          "w-23.5 absolute transition-all duration-500 pointer-events-none bg-background/80",
          savedPage.mode === "kanji" ? "translate-0" : "translate-x-25",
        )}
        variant="outline"
      />
      <Button variant="ghost" onclick={() => (savedPage.mode = "kanji")}>
        <Label>{appText.v.page.kanji}s</Label>
      </Button>
      <Button variant="ghost" onclick={() => (savedPage.mode = "word")}>
        <Label>{appText.v.page.word}</Label>
      </Button>
    </div>
  </div>
</div>
<div
  class="w-full h-full pt-2 overflow-y-scroll overflow-x-hidden scrollbar-hide"
>
  <div class="w-full h-full flex justify-center relative">
    <div
      class={cn(
        "w-full h-full pb-4 flex justify-center absolute transition-all duration-500",
        savedPage.mode === "kanji" ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div class="w-full h-full" bind:clientWidth={kanjiDivSize}>
        {#if savedPage.kanjis.length === 0}
          <div class="w-full flex justify-center">
            <Badge class="text-xl font-medium mt-10"
              >{appText.v.badge.notFound}（ ¬＿¬)
            </Badge>
          </div>
        {/if}
        <VList
          class="w-full h-40 flex gap-1 justify-center items-center overflow-y-scroll overflow-x-none scrollbar-hide"
          data={rowedKanjis}
          bufferSize={1000}
          getKey={(_, i) => i}
          tabindex={-1}
        >
          {#snippet children(kanjis: Kanji[], _)}
            <div class="flex gap-1 mb-1 justify-center">
              {#each kanjis as kanji, i (i)}
                <KanjiCard {kanji} />
              {/each}
            </div>
          {/snippet}
        </VList>
      </div>
    </div>
    <div
      class={cn(
        "w-full h-full pb-4 flex flex-col justify-start items-center absolute transition-all duration-500",
        savedPage.mode === "word" ? "translate-x-0" : "translate-x-full",
      )}
    >
      {#if savedPage.words.length === 0}
        <div class="w-full flex justify-center">
          <Badge class="text-xl font-medium mt-10"
            >{appText.v.badge.notFound} (⊙_☉)</Badge
          >
        </div>
      {/if}
      <VList
        class="w-120 h-40 flex justify-center items-center overflow-y-scroll overflow-x-none scrollbar-hide"
        data={savedPage.words}
        getKey={(_, i) => i}
        tabindex={-1}
      >
        {#snippet children(word: Word, _)}
          <WordCard {word} />
        {/snippet}
      </VList>
    </div>
  </div>
</div>
