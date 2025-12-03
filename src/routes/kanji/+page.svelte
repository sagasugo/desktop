<script lang="ts">
  import { VList } from "virtua/svelte";
  import { toKana, toRomaji } from "wanakana";
  import { Badge, Button, Input, Label, Separator } from "@/lib/components";
  import { KanjiCard, Select } from "@/components";
  import { cn } from "@/lib/utils";
  import { db } from "@/db/client";
  import { kanjis, kanjiMeanings } from "@/db/schema";
  import type { Kanji } from "@/type";
  import { onMount } from "svelte";
  import { ScrollingValue } from "svelte-ux";
  import { page } from "$app/state";
  import { appText, kanjiPage } from "@/states";
  import Icon from "@iconify/svelte";

  let search = $state("");
  let searchKana = $derived(
    toKana(search).replace(
      /[^\u3040-\u309F\u30A0-\u30FF\u3001-\u303F\uFF01-\uFF60.?!\-\s]/g,
      "",
    ),
  );
  let divSize = $state(0);
  let divKanjis: HTMLDivElement = $state(null!);
  let mounted = $state(false);
  let getKanjisQuery = $derived(
    db.query.kanjis
      .findMany({
        with: {
          saved: true,
          meanings: true,
        },
        where: (kanjis, { eq, like, or, and, exists, isNull }) =>
          and(
            kanjiPage.jlpt
              ? kanjiPage.jlpt === "0"
                ? isNull(kanjis.jlpt)
                : eq(kanjis.jlpt, Number(kanjiPage.jlpt))
              : undefined,
            kanjiPage.grade
              ? eq(kanjis.grade, Number(kanjiPage.grade))
              : undefined,
            kanjiPage.strokeCount
              ? eq(kanjis.strokeCount, Number(kanjiPage.strokeCount))
              : undefined,
            search !== ""
              ? or(
                  eq(kanjis.kanji, search),
                  like(kanjis.radicals, `%${search}$`),
                  searchKana
                    ? like(kanjis.onReadings, `%${searchKana}%`)
                    : undefined,
                  searchKana
                    ? like(kanjis.kunReadings, `%${searchKana}%`)
                    : undefined,
                  exists(
                    db
                      .select()
                      .from(kanjiMeanings)
                      .where(
                        and(
                          eq(kanjiMeanings.kanji, kanjis.kanji),
                          like(kanjiMeanings.meanings, `%${search}%`),
                        ),
                      ),
                  ),
                )
              : undefined,
          ),
      })
      .prepare(),
  );

  let showedKanjis: Kanji[] = $derived(
    mounted ? await getKanjisQuery.execute() : [],
  );
  let rowedKanjis: Kanji[][] = $derived.by(() => {
    if (!divSize || divSize < 107) return [showedKanjis];
    const itemsPerRow = Math.floor(divSize / 107);
    return showedKanjis.reduce((acc: Kanji[][], _, i) => {
      if (i % itemsPerRow === 0)
        acc.push(showedKanjis.slice(i, i + itemsPerRow));
      return acc;
    }, []);
  });

  onMount(() => {
    mounted = true;
  });
</script>

<div class="w-full h-full flex !overflow-x-none">
  <div
    class={cn(
      "w-full h-full flex flex-col items-center p-2 gap-4 overflow-x-none",
    )}
  >
    <div
      class="w-full flex flex-col-reverse md:flex-row justify-center items-center gap-2"
    >
      <div class="flex items-center gap-2">
        <Badge
          class={cn(
            "h-10 flex justify-center items-center",
            appText.language === "en" ? "w-24" : "w-36",
          )}
          variant="outline"
        >
          <ScrollingValue value={$state.eager(showedKanjis.length)} axis="y" />
          {appText.v.badge.count}
        </Badge>
        <div class="flex flex-col text-primary parent">
          <Input
            variant="outline"
            placeholder={appText.v.input.kanji}
            bind:value={search}
            oninput={() => {
              // divKanjis.scrollTo({ top: 0, behavior: "instant" })
            }}
          />
          <Label class="absolute ml-2.5 mt-8 kanji-font">
            {$state.eager(searchKana)}
          </Label>
        </div>
      </div>
      <div
        class={cn(
          "flex items-center gap-2",
          kanjiPage.compareMode && "flex-row-reverse",
        )}
      >
        <div class="flex items-center gap-2">
          <Select
            classPopup="w-18"
            label="JLPT"
            bind:selected={kanjiPage.jlpt}
            items={["5", "4", "3", "2", "1", "0"]}
            itemsLabel={{
              "5": "N5",
              "4": "N4",
              "3": "N3",
              "2": "N2",
              "1": "N1",
              "0": "Non JLPT",
            }}
          />
          <Select
            label="Grade"
            bind:selected={kanjiPage.grade}
            items={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            itemsLabel={{
              "1": "Grade 1",
              "2": "Grade 2",
              "3": "Grade 3",
              "4": "Grade 4",
              "5": "Grade 5",
              "6": "Grade 6",
              "7": "Junior High 1",
              "8": "Junior High 2",
              "9": "Senior High 1",
              "10": "Senior High 2",
            }}
          />
          <Select
            classPopup="w-16"
            label="Strokes"
            bind:selected={kanjiPage.strokeCount}
            items={[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30",
              "31",
              "32",
              "33",
              "34",
            ]}
          />
        </div>
        <Button
          class={cn(
            "transition-all duration-500",
            !kanjiPage.compareMode && "text-primary/60",
          )}
          variant={$state.eager(kanjiPage.compareMode) ? "default" : "outline"}
          onclick={() => {
            kanjiPage.comparedKanjis = [];
            kanjiPage.compareMode = !kanjiPage.compareMode;
          }}
        >
          <Icon class="size-4!" icon="material-symbols:text-compare-rounded" />
          {kanjiPage.compareMode
            ? `${appText.v.btn.selectMore} ${2 - kanjiPage.comparedKanjis.length}`
            : appText.v.btn.compare}
        </Button>
      </div>
    </div>
    <div class="w-full h-full" bind:clientWidth={divSize}>
      {#if showedKanjis.length === 0}
        <div class="w-full flex justify-center">
          <Badge class="text-xl font-medium mt-10"
            >{appText.v.badge.notFound} ╥﹏╥</Badge
          >
        </div>
      {/if}
      <VList
        class="w-full h-40 flex gap-1 justify-center items-center overflow-y-scroll overflow-x-none scrollbar-hide"
        data={rowedKanjis}
        bufferSize={1000}
        getKey={(_, i) => i}
        tabindex={-1}
        bind:this={divKanjis}
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
</div>
