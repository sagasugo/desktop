<script lang="ts">
  import { db } from "@/db/client";
  import { Button, Drawer, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { selectedItem } from "@/states";
  import type { Kanji, Word } from "@/type";
  import Icon from "@iconify/svelte";

  let open = $state(false);
  let openKanji: Kanji | null = $state(null);
  let openWord: Word | null = $state(null);
  let history: (Kanji | Word)[] = $state([]);
  let relatedWords: Word[] = $derived(
    openKanji
      ? await db.query.words
          .findMany({
            with: {
              translations: true,
            },
            where: (words, { like }) =>
              like(words.mainKanjis, `%${openKanji?.kanji}%`),
            orderBy: (words, { asc }) => [asc(words.mainReading)],
          })
          .execute()
      : [],
  );

  $effect(() => {
    if (selectedItem.value !== null) {
      open = true;
      if ("kanji" in selectedItem.value) {
        openKanji = selectedItem.value;
      }
      if ("mainWriting" in selectedItem.value) {
        openWord = selectedItem.value;
      }
    }
  });
</script>

<Drawer.Root
  bind:open
  onOpenChange={open => {
    if (!open) {
      selectedItem.value = null;
      openKanji = null;
      openWord = null;
      history = [];
    }
  }}
>
  <Drawer.Content
    class="h-[65vh] data-[vaul-drawer-direction=bottom]:max-h-160 text-primary items-center"
  >
    <div
      class="w-full h-full parent flex flex-col justify-center items-center overflow-hidden"
    >
      <Button
        class="size-8 absolute top-0 right-0 z-50"
        variant="ghost"
        onclick={() => (open = false)}
      >
        <Icon class="size-5!" icon="lucide:x" />
      </Button>
      <div
        class={cn(
          "w-full h-full flex flex-col items-center absolute transition-all duration-500",
          selectedItem.itemType === "kanji"
            ? "translate-x-0"
            : "-translate-x-[150vw]",
        )}
      >
        <div class="flex gap-10">
          <Label class="text-[10rem] kanji-font">{openKanji?.kanji}</Label>
          <div class="flex flex-col justify-center">
            <Label class="text-2xl max-w-70 break-normal wrap-break-word">
              {openKanji?.meanings?.[0]?.meanings?.join(", ")}
            </Label>
            <Label
              class="text-2xl max-w-96 kanji-font break-normal wrap-break-word"
            >
              {openKanji?.onReadings?.join(", ")}
            </Label>
            <Label
              class="text-2xl max-w-96 kanji-font break-normal wrap-break-word"
            >
              {openKanji?.kunReadings?.join(", ")}
            </Label>
          </div>
        </div>
        {#if openWord && openKanji}
          <Button
            class="absolute right-6 top-4 kanji-font"
            onclick={() => (selectedItem.value = openWord)}
            >{openWord?.mainWriting}
            <Icon
              class="size-5! -mr-2"
              icon="material-symbols:arrow-forward-ios-rounded"
            />
          </Button>
        {/if}
      </div>
      <div
        class={cn(
          "w-full h-full flex flex-col items-center absolute transition-all duration-500",
          selectedItem.itemType === "word"
            ? "translate-x-0"
            : "translate-x-[150vw]",
        )}
      >
        <div class="flex gap-10">
          <Label class="text-[5rem] kanji-font">{openWord?.mainWriting}</Label>
          <div class="flex flex-col justify-center">
            <Label class="text-2xl max-w-70 break-normal wrap-break-word">
              {openWord?.translations?.[0]?.meanings?.join(",")}
            </Label>
            <Label
              class="text-2xl max-w-96 kanji-font break-normal wrap-break-word"
            >
              {openWord?.variants?.map(v => v.writing).join(", ")}
            </Label>
            <div class="flex gap-1">
              {#each openWord?.mainKanjis ?? [] as k}
                <Button
                  class="size-10 rounded-md kanji-font"
                  variant="outline"
                  onclick={async () => {
                    const kanji = await db.query.kanjis.findFirst({
                      with: {
                        meanings: true,
                      },
                      where: (kanjis, { eq }) => eq(kanjis.kanji, k),
                    });
                    if (kanji) {
                      selectedItem.value = kanji;
                    }
                  }}
                >
                  <Label class="text-2xl cursor-pointer">
                    {k}</Label
                  ></Button
                >
              {/each}
              <!-- {selectedItem.value?.mainKanjis?.join(", ")} -->
            </div>
          </div>
        </div>
        {#if openWord && openKanji}
          <Button
            class="absolute left-6 top-4 kanji-font"
            onclick={() => (selectedItem.value = openKanji)}
          >
            <Icon
              class="size-5!"
              icon="material-symbols:arrow-back-ios-rounded"
            />
            {openKanji?.kanji}
          </Button>
        {/if}
      </div>
    </div>
  </Drawer.Content>
</Drawer.Root>
