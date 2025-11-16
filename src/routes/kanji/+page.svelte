<script lang="ts">
  import { VList } from "virtua/svelte";
  import { toHiragana, toRomaji } from "wanakana";
  import { fdppp as kanji } from "@/constants";
  import { Input, Separator } from "@/lib/components";
  import { KanjiCard } from "@/components";
  import { kanjiShowed } from "@/states";
  import { cn } from "@/lib/utils";
  import { db } from "@/db/client";
  import { kanjis } from "@/db/schema";
  import type { Kanji } from "@/type";
  import { onMount } from "svelte";
  import { eq } from "drizzle-orm";

  let search = $state("");
  let searchKana = $derived(toHiragana(search));
  let divSize = $state(0);

  let kanjiData: Kanji[] = $state(await db.select().from(kanjis));
  let showedKanjis: Kanji[] = $derived(
    kanjiData.filter(
      (k) =>
        k.mainOnReading?.includes(searchKana) ||
        k.mainKunReading?.includes(searchKana) ||
        toRomaji(k.mainOnReading ?? "").includes(search) ||
        toRomaji(k.mainKunReading ?? "").includes(search) ||
        k.jlpt?.toString() === search,
    ),
  );
  let rowedKanjis = $derived.by(() => {
    if (!divSize || divSize < 77) return [showedKanjis];
    const itemsPerRow = Math.floor(divSize / 77);
    const result: Kanji[][] = [];
    for (let i = 0; i < showedKanjis.length; i += itemsPerRow) {
      result.push(showedKanjis.slice(i, i + itemsPerRow));
    }
    console.log("finished.");
    return result;
  });
  // let rowedKanjis = $derived(
  //   showedKanjis.reduce((resultArray: Kanji[][], item, index) => {
  //     const chunkIndex = Math.floor(index / (divSize / 77));
  //     if (!resultArray[chunkIndex]) {
  //       resultArray[chunkIndex] = [];
  //     }
  //     resultArray[chunkIndex].push(item);
  //     return resultArray;
  //   }, []),
  // );
</script>

<div class="w-full h-full flex !overflow-x-none">
  <div
    class={cn(
      "w-full h-full flex flex-col items-center p-2 gap-4 overflow-x-none",
    )}
  >
    <div class="flex flex-col h-20! p-4 w-8/10 text-primary">
      <Input
        variant="link"
        placeholder="Search kanjis..."
        bind:value={search}
      />
      {searchKana}
    </div>
    <div class="w-full h-full" bind:clientWidth={divSize}>
      <VList
        class="w-full h-40 flex gap-1 justify-center items-center overflow-y-scroll overflow-x-none scrollbar scroll-smooth"
        data={rowedKanjis}
        getKey={(_, i) => i}
        overscan={3}
        tabindex={-1}
      >
        {#snippet children(kanjis, _)}
          <div class="flex gap-1 mb-1 justify-center">
            {#each kanjis as kanji, i (i)}
              <KanjiCard {kanji} />
            {/each}
          </div>
        {/snippet}
      </VList>
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
  <!-- <Separator orientation="vertical" /> -->
  <!-- <div -->
  <!--   class={cn( -->
  <!--     "flex flex-col items-center justify-center transition-all duration-300", -->
  <!--     kanjiShowed.value === null ? "size-0 m-0 p-0" : "w-1/2 h-full", -->
  <!--   )} -->
  <!-- > -->
  <!--   <h1 class="text-[12rem] text-primary"> -->
  <!--     {kanjiShowed.value?.kanji} -->
  <!--   </h1> -->
  <!--   <span class="text-primary text-4xl"> -->
  <!--     {kanjiShowed.value?.onReadings} -->
  <!--   </span> -->
  <!--   <span class="text-primary text-2xl"> -->
  <!--     {kanjiShowed.value?.kunReadings} -->
  <!--   </span> -->
  <!--   <span class="text-primary text-2xl"> -->
  <!--     {kanjiShowed.value?.radicals} -->
  <!--   </span> -->
  <!--   <span class="p-4 text-primary text-xl"> -->
  <!--     JLPT {kanjiShowed.value?.jlpt} -->
  <!--   </span> -->
  <!-- </div> -->
</div>
