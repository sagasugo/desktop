<script lang="ts">
  import { db } from "@/db/client";
  import { Badge, Button, Input, Label } from "@/lib/components";
  import { VList } from "virtua/svelte";
  import { toHiragana } from "wanakana";
  import type { Word } from "@/type";
  import { ScrollingValue } from "svelte-ux";

  let search = $state("");
  let searchKana = $derived(
    toHiragana(search).replace(
      /[^\u3040-\u309F\u30A0-\u30FF\u3001-\u303F\uFF01-\uFF60.?!\-\s]/g,
      "",
    ),
  );

  let getWordsQuery = $derived(
    db.query.words
      .findMany({
        with: {
          translations: true,
        },
        where: (words, { like }) => like(words.mainReading, `%${searchKana}%`),
        limit: 2000,
      })
      .prepare(),
  );

  let foundWords: Word[] = $derived(await getWordsQuery.execute());
</script>

<div class="flex flex-col justify-start items-center w-full h-full">
  <div class="w-full px-12 flex justify-center items-center">
    <Badge class="h-10 w-24 flex justify-center items-center" variant="outline">
      <ScrollingValue class="-mt-4.5" value={foundWords.length} axis="y" />
      Found
    </Badge>
    <div class="flex flex-col p-4 text-primary parent">
      <Input
        variant="outline"
        placeholder="Search words..."
        bind:value={search}
      />
      <Label class="absolute ml-2.5 mt-10">
        {searchKana}
      </Label>
    </div>
  </div>
  <VList
    class="w-120 h-40 flex gap-2 justify-center items-center overflow-y-scroll overflow-x-none scrollbar scroll-smooth"
    data={foundWords}
    getKey={(_, i) => i}
    tabindex={-1}
  >
    {#snippet children(word: Word, _)}
      <div class="w-full flex justify-center">
        <Button class="w-100 rounded-sm" variant="outline">
          <Label class="text-xl">
            {word.mainWriting}
          </Label>
        </Button>
      </div>
    {/snippet}
  </VList>
</div>
