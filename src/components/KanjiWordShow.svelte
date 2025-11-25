<script lang="ts">
  import { db } from "@/db/client";
  import { writeText } from "@tauri-apps/plugin-clipboard-manager";
  import { Badge, Button, Drawer, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { selectedItem, speech } from "@/states";
  import type { Kanji, Word } from "@/type";
  import Icon from "@iconify/svelte";

  let open = $state(false);
  let openKanji: Kanji | null = $state(null);
  let openWord: Word | null = $state(null);
  // let history: (Kanji | Word)[] = $state([]);
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
  onOpenChangeComplete={open => {
    if (!open) {
      selectedItem.value = null;
      openKanji = null;
      openWord = null;
      // history = [];
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
          <div class="flex flex-col justify-center">
            <Label class="flex justify-center text-2xl"
              >{openKanji?.meanings[0]?.keyword}</Label
            >
            <Label class="text-[10rem] kanji-font">{openKanji?.kanji}</Label>
            <div class={cn("flex gap-2", openKanji === null && "hidden")}>
              <Button
                disabled={!speech.isJPAvailable}
                variant="outline"
                onclick={() =>
                  speech.speak(
                    openKanji?.mainOnReading ?? openKanji?.mainKunReading,
                  )}
              >
                <Icon
                  class="size-4!"
                  icon={speech.isJPAvailable
                    ? "lucide:volume-2"
                    : "lucide:volume-off"}
                />
                Hear
              </Button>
              <Button
                variant="outline"
                onclick={() => writeText(openKanji?.kanji ?? "")}
              >
                <Icon class="size-4!" icon="lucide:copy" />
                Copy
              </Button>
            </div>
          </div>
          <div class="flex flex-col justify-center gap-2">
            <Label class="text-xl max-w-70 break-normal wrap-break-word">
              {openKanji?.meanings?.[0]?.meanings?.join(", ")}
            </Label>
            {#if openKanji?.mainOnReading}
              <Badge class="text-md" variant="outline">
                On yomi:
                <p class="text-xl max-w-120 kanji-font">
                  {#each openKanji?.onReadings ?? [] as onReading, i (i)}
                    <button onclick={() => speech.speak(onReading)}>
                      {onReading}
                    </button>
                    {(openKanji?.onReadings?.length ?? 1) > 1 &&
                    i + 1 < (openKanji?.onReadings?.length ?? 1)
                      ? ","
                      : ""}
                    {#if i === 4 || i == 9 || i === 14}
                      <br />
                    {/if}
                  {/each}
                </p>
              </Badge>
            {/if}
            {#if openKanji?.mainKunReading}
              <Badge class="text-md" variant="outline">
                Kun yomi:
                <p class="text-xl max-w-120 kanji-font">
                  {#each openKanji?.kunReadings ?? [] as kunReading, i (i)}
                    <button onclick={() => speech.speak(kunReading)}>
                      {kunReading}
                    </button>
                    {(openKanji?.kunReadings?.length ?? 1) > 1 &&
                    i + 1 < (openKanji?.kunReadings?.length ?? 1)
                      ? ","
                      : ""}
                    {#if i === 4 || i == 9 || i === 14}
                      <br />
                    {/if}
                  {/each}
                  <!-- {openKanji?.kunReadings?.join(", ")} <br /> -->
                </p>
              </Badge>
            {/if}
            <div class="flex items-start gap-2 [&>*]:w-30">
              <Badge class={cn(openKanji === null && "hidden")}>
                <Label class="text-lg">Strokes {openKanji?.strokeCount}</Label>
              </Badge>
              {#if openKanji?.jlpt}
                <Badge class="bg-pink-600" variant="secondary">
                  <Label class="text-lg">JLPT N{openKanji?.jlpt}</Label>
                </Badge>
              {/if}
              {#if openKanji?.grade}
                <Badge class="bg-red-800" variant="outline">
                  <Label class="text-lg">Grade {openKanji?.grade}</Label>
                </Badge>
              {/if}
            </div>
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
          "w-full h-full flex flex-col items-center pt-20 absolute transition-all duration-500",
          selectedItem.itemType === "word"
            ? "translate-x-0"
            : "translate-x-[150vw]",
        )}
      >
        <div class="flex gap-10">
          <div class="min-w-70 flex flex-col items-center gap-2">
            <div class="flex flex-col items-center -gap-x-1">
              <Label class="text-xl kanji-font">{openWord?.mainReading}</Label>
              <Label class="text-[3rem] kanji-font"
                >{openWord?.mainWriting}</Label
              >
            </div>
            <div class="flex gap-2">
              <Button
                disabled={!speech.isJPAvailable}
                variant="outline"
                onclick={() => speech.speak(openWord?.mainReading)}
              >
                <Icon
                  class="size-4!"
                  icon={speech.isJPAvailable
                    ? "lucide:volume-2"
                    : "lucide:volume-off"}
                />
                Hear
              </Button>
              <Button
                variant="outline"
                onclick={() => writeText(openWord?.mainWriting ?? "")}
              >
                <Icon class="size-4!" icon="lucide:copy" />
                Copy
              </Button>
            </div>
          </div>
          <div class="flex flex-col gap-2 justify-center">
            <Label class="text-2xl max-w-70 break-normal wrap-break-word">
              {openWord?.translations?.[0]?.meanings?.join(",")}
            </Label>
            <div class="h-22 overflow-x-hidden overflow-y-scroll scrollbar">
              {#each openWord?.variants ?? [] as variant, i (i)}
                <Button
                  class="w-full h-13 flex flex-col gap-0 justify-center items-center rounded-md kanji-font"
                  variant="outline"
                  onclick={() => speech.speak(variant.reading)}
                >
                  <p>{variant.reading}</p>
                  <p class="text-xl">{variant.writing}</p>
                </Button>
              {/each}
            </div>
            <!-- <Label -->
            <!--   class="text-2xl max-w-96 kanji-font break-normal wrap-break-word" -->
            <!-- > -->
            <!---->
            <!--   {openWord?.variants?.map(v => v.writing).join(", ")} -->
            <!-- </Label> -->
            <div class="flex gap-1">
              {#each openWord?.mainKanjis ?? [] as k}
                <Button
                  class="size-12 rounded-md bg-pink-900 hover:bg-pink-600 text-xl kanji-font"
                  variant="secondary"
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
