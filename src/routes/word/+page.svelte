<script lang="ts">
  import { db } from "@/db/client";
  import { Badge, Button, Input, Label } from "@/lib/components";
  import { VList } from "virtua/svelte";
  import { toKana } from "wanakana";
  import type { Word } from "@/type";
  import { ScrollingValue } from "svelte-ux";
  import { WordCard } from "@/components";
  import { wordTranslations } from "@/db/schema";
  import { onMount } from "svelte";
  import { appText } from "@/states";
  import { cn } from "@/lib/utils";

  let search = $state("");
  let searchKana = $derived(
    toKana(search).replace(
      /[^\u3040-\u309F\u30A0-\u30FF\u3001-\u303F\uFF01-\uFF60.?!\-\s]/g,
      "",
    ),
  );
  let mounted = $state(false);
  let divWords: HTMLDivElement = $state(null!);

  let getWordsQuery = $derived(
    db.query.words
      .findMany({
        with: {
          saved: true,
          translations: true,
        },
        where: (words, { eq, like, exists, or, and }) =>
          search !== ""
            ? or(
                searchKana
                  ? like(words.mainReading, `%${searchKana}%`)
                  : undefined,
                like(words.mainWriting, `%${search}%`),
                like(words.mainKanjis, `%${search}`),
                exists(
                  db
                    .select()
                    .from(wordTranslations)
                    .where(
                      and(
                        eq(wordTranslations.writing, words.mainWriting),
                        like(wordTranslations.meanings, `%${search}%`),
                      ),
                    ),
                ),
              )
            : undefined,
        orderBy: (words, { sql, asc }) => [
          asc(sql`length(${words.mainReading})`),
        ],
        limit: 2000,
      })
      .prepare(),
  );

  let foundWords: Word[] = $derived(
    mounted ? await getWordsQuery.execute() : [],
  );

  onMount(() => {
    mounted = true;
  });
</script>

<div class="flex flex-col justify-start items-center w-full h-full">
  <div class="w-full px-12 flex justify-center items-center">
    <Badge
      class={cn(
        "h-10 flex justify-center items-center",
        appText.language === "en" ? "w-24" : "w-36",
      )}
      variant="outline"
    >
      <ScrollingValue value={$state.eager(foundWords.length)} axis="y" />
      {appText.v.badge.count}
    </Badge>
    <div class="flex flex-col p-4 text-primary parent">
      <Input
        variant="outline"
        placeholder={appText.v.input.word}
        bind:value={search}
        oninput={() => {
          // divWords.scrollTo({ top: 0, behavior: "instant" })
        }}
      />
      <Label class="absolute ml-2.5 mt-10 kanji-font">
        {$state.eager(searchKana)}
      </Label>
    </div>
  </div>
  {#if foundWords.length === 0}
    <div class="w-full flex justify-center">
      <Badge class="text-xl font-medium mt-10"
        >{appText.v.badge.notFound} (ノ﹏ヽ)</Badge
      >
    </div>
  {/if}
  <VList
    class="w-120 h-40 flex justify-center items-center overflow-y-scroll overflow-x-none scrollbar-hide"
    data={foundWords}
    getKey={(_, i) => i}
    tabindex={-1}
    bind:this={divWords}
  >
    {#snippet children(word: Word, _)}
      <WordCard {word} />
    {/snippet}
  </VList>
</div>
