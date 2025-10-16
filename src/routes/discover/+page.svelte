<script lang="ts">
  import { VList } from "virtua/svelte";
  import { toHiragana } from "wanakana";
  import { kanjis } from "@/constants";
  import { Input, Separator } from "@/lib/components";
  import { KanjiCard } from "@/components";
  import { kanjiShowed } from "@/states";
  import { cn } from "@/lib/utils";

  let search = $state("");
  let searchKana = $derived(toHiragana(search));
</script>

<div class="w-full h-full flex !overflow-x-none">
  <div
    class={cn(
      "h-full flex flex-col items-center p-2 gap-4 overflow-x-none",
      kanjiShowed.value === null ? "w-full" : "w-1/2",
    )}
  >
    <Input
      class="w-8/10 text-primary"
      placeholder="Search kanjis..."
      bind:value={search}
    />
    <div
      class="flex flex-wrap gap-1 justify-center overflow-y-scroll overflow-x-none"
    >
      {#each kanjis as kanji, i (i)}
        {#if search === "" || kanji.furigana.includes(searchKana) || kanji.jlpt.includes(search) || kanji.meaning[0].includes(search)}
          <KanjiCard {kanji} />
        {/if}
      {/each}
    </div>
    <!-- <VList -->
    <!--   class="scrollbar-chapters scroll-smooth flex flex-col [&>*]:w-2" -->
    <!--   data={kanjis} -->
    <!--   getKey={(_, i) => i} -->
    <!--   overscan={30} -->
    <!--   tabindex={-1} -->
    <!-- > -->
    <!--   {#snippet children(kanji, _)} -->
    <!--     <KanjiCard {kanji} /> -->
    <!--   {/snippet} -->
    <!-- </VList> -->
  </div>
  <Separator orientation="vertical" />
  <div
    class={cn(
      "flex flex-col items-center justify-center transition-all duration-300",
      kanjiShowed.value === null ? "size-0 m-0 p-0" : "w-1/2 h-full",
    )}
  >
    <h1 class="text-[12rem] text-primary">
      {kanjiShowed.value?.radical}
    </h1>
    <span class="text-primary text-4xl">
      {kanjiShowed.value?.furigana}
    </span>
    <span class="text-primary text-2xl">
      {kanjiShowed.value?.meaning}
    </span>
    <span class="text-primary text-2xl">
      {kanjiShowed.value?.jlpt}
    </span>
    <span class="p-4 text-primary text-xl">
      {kanjiShowed.value?.phrases[0]}
    </span>
  </div>
</div>
