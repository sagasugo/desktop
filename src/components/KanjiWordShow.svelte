<script lang="ts">
  import { db } from "@/db/client";
  import { writeText } from "@tauri-apps/plugin-clipboard-manager";
  import { EditNotes, Tooltip } from "@/components";
  import { Badge, Button, Drawer, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { appText, savedPage, selectedItem, speech } from "@/states";
  import type { Kanji, Word } from "@/type";
  import Icon from "@iconify/svelte";
  import { sleep } from "@/utils";
  import { savedKanjis, savedWords } from "@/db/schema";
  import { eq } from "drizzle-orm";
  import { toKatakana } from "wanakana";

  let open = $state(false);
  let openKanji: Kanji | null = $state(null);
  let openWord: Word | null = $state(null);
  let copied = $state(false);
  // let history: (Kanji | Word)[] = $state([]);
  let relatedWords: Word[] = $derived(
    openKanji
      ? await db.query.words
          .findMany({
            with: {
              saved: true,
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
    class="h-[88vh] data-[vaul-drawer-direction=bottom]:max-h-120 max-h-120 text-primary items-center"
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
          <div class="flex flex-col justify-center items-center gap-2">
            <Label class="flex justify-center text-2xl"
              >{openKanji?.meanings[0]?.keyword}</Label
            >
            <Label class="text-[10rem] kanji-font">{openKanji?.kanji}</Label>
            <div class={cn("flex gap-2", openKanji === null && "hidden")}>
              <Tooltip
                disabled={speech.isJPAvailable}
                text={appText.v.tooltip.hear}
              >
                <Button
                  class={cn(
                    !(openKanji?.mainOnReading ?? openKanji?.mainKunReading) &&
                      "hidden",
                    !speech.isJPAvailable &&
                      "opacity-60 hover:bg-background/30",
                  )}
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
                  {appText.v.btn.hear}
                </Button>
              </Tooltip>
              <Button
                class={cn(
                  "w-28 transition-all duration-300",
                  copied && "bg-green-700 hover:bg-green-800",
                )}
                variant="outline"
                onclick={async () => {
                  if (copied) return;
                  await writeText(openKanji?.kanji ?? "");
                  copied = true;
                  await sleep(800);
                  copied = false;
                }}
              >
                <Icon
                  class="size-4!"
                  icon={copied ? "lucide:check" : "lucide:copy"}
                />
                {copied ? appText.v.btn.copySucessful : appText.v.btn.copy}
              </Button>
            </div>
            <Badge
              class={cn(
                "w-full justify-between text-xl border-pink-400",
                (openKanji === null || openKanji?.radicals?.length === 0) &&
                  "hidden",
              )}
              variant="outline"
              >Radicals
              <p class="text-xl max-w-50 kanji-font">
                {#each openKanji?.radicals ?? [] as radical, i (i)}
                  <button
                    onclick={async () => {
                      const possibleKanji = await db.query.kanjis.findFirst({
                        with: {
                          saved: true,
                          meanings: true,
                        },
                        where: (kanjis, { eq }) => eq(kanjis.kanji, radical),
                      });
                      if (possibleKanji) {
                        selectedItem.value = possibleKanji;
                      }
                    }}
                  >
                    {radical}
                  </button>
                  {(openKanji?.radicals?.length ?? 1) > 1 &&
                  i + 1 < (openKanji?.radicals?.length ?? 1)
                    ? ","
                    : ""}
                {:else}
                  -
                {/each}
              </p>
            </Badge>
          </div>
          <div class="flex flex-col justify-center gap-2">
            {#if openKanji?.meanings.length ?? 0 > 0}
              <Badge variant="outline">
                {appText.v.badge.meanings}
              </Badge>
              <div
                class="w-70 h-24 p-2 border-2 border-secondary/40 rounded-xl text-xl max-w-70 overflow-x-hidden overflow-y-auto scrollbar break-normal wrap-break-word"
              >
                {#each openKanji?.meanings?.[0]?.meanings ?? [] as meaning}
                  <p class="pb-1 border-b-primary/50 border-b-1">
                    {meaning}
                  </p>
                {/each}
              </div>
            {/if}

            <!-- <Label class="text-xl max-w-70 break-normal wrap-break-word"> -->
            <!--   {openKanji?.meanings?.[0]?.meanings?.join(", ")} -->
            <!-- </Label> -->
            {#if openKanji?.mainOnReading}
              <Badge class="text-md items-start" variant="outline">
                On yomi:
                <p class="text-xl max-w-120 kanji-font">
                  {#each openKanji?.onReadings ?? [] as onReading, i (i)}
                    <button onclick={() => speech.speak(onReading)}>
                      {toKatakana(onReading)}
                    </button>
                    {(openKanji?.onReadings?.length ?? 1) > 1 &&
                    i + 1 < (openKanji?.onReadings?.length ?? 1)
                      ? ","
                      : ""}
                    {#if i === 3 || i == 8 || i === 13}
                      <br />
                    {/if}
                  {/each}
                </p>
              </Badge>
            {/if}
            {#if openKanji?.mainKunReading}
              <Badge class="text-md items-start" variant="outline">
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
                    {#if i === 3 || i == 8 || i === 13}
                      <br />
                    {/if}
                  {/each}
                  <!-- {openKanji?.kunReadings?.join(", ")} <br /> -->
                </p>
              </Badge>
            {/if}
            <div class="flex items-start gap-2 [&>*]:w-30">
              <Badge class={cn(openKanji === null && "hidden")}>
                <Label class="text-lg"
                  >{appText.v.badge.stroke} {openKanji?.strokeCount}</Label
                >
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
            <div class="flex items-start gap-2">
              <Button
                class={cn(
                  "w-30 justify-around text-md transition-all",
                  openKanji === null && "hidden",
                )}
                variant="outline"
                onclick={async () => {
                  if (!openKanji?.saved) {
                    await db.insert(savedKanjis).values({
                      kanji: openKanji?.kanji ?? "",
                      notes: "",
                    });
                  } else {
                    await db
                      .delete(savedKanjis)
                      .where(eq(savedKanjis.kanji, openKanji?.kanji ?? ""));
                  }
                  const updatedKanji = await db.query.kanjis.findFirst({
                    with: {
                      saved: true,
                      meanings: true,
                    },
                    where: (kanjis, { eq }) =>
                      eq(kanjis.kanji, openKanji?.kanji ?? ""),
                  });
                  openKanji = updatedKanji || null;
                  savedPage.refreshKanjis();
                }}
              >
                <Icon
                  class="size-5!"
                  icon={openKanji?.saved
                    ? "material-symbols:bookmark-rounded"
                    : "material-symbols:bookmark-outline-rounded"}
                />
                {openKanji?.saved ? appText.v.btn.remove : appText.v.btn.save}
              </Button>
              {#if openKanji?.saved}
                <EditNotes
                  bind:text={openKanji.saved.notes}
                  hasNote={openKanji.saved?.notes !== ""}
                  onSave={async () => {
                    await db
                      .update(savedKanjis)
                      .set({
                        notes: openKanji?.saved?.notes,
                      })
                      .where(eq(savedKanjis.kanji, openKanji?.kanji ?? ""));
                    openKanji =
                      (await db.query.kanjis.findFirst({
                        with: { saved: true, meanings: true },
                        where: (kanjis, { eq }) =>
                          eq(kanjis.kanji, openKanji?.kanji ?? ""),
                      })) || null;
                  }}
                />
              {/if}
            </div>
            <div class="flex flex-col gap-2">
              {#if (openKanji?.saved?.notes.length ?? 0) > 0}
                <Badge variant="outline">
                  <Label class="text-xl">{appText.v.badge.notes}:</Label>
                </Badge>
                <p
                  class="w-auto p-2 bg-pink-500/15 rounded-md whitespace-break-spaces"
                >
                  {openKanji?.saved?.notes}
                </p>
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
          "w-full h-full flex flex-col items-center pt-2 absolute transition-all duration-500",
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
              {#if openWord?.translations.length ?? 0 > 0}
                <Label class="text-xl max-w-82 line-clamp-2"
                  >{openWord?.translations?.[0].mainMeaning}</Label
                >
              {/if}
            </div>
            <div class="flex gap-2">
              <Tooltip
                disabled={speech.isJPAvailable}
                text={appText.v.tooltip.hear}
              >
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
                  {appText.v.btn.hear}
                </Button>
              </Tooltip>
              <Button
                class={cn(
                  "w-28 transition-all duration-300",
                  copied && "bg-green-700 hover:bg-green-800",
                )}
                variant="outline"
                onclick={async () => {
                  if (copied) return;
                  await writeText(openWord?.mainWriting ?? "");
                  copied = true;
                  await sleep(800);
                  copied = false;
                }}
              >
                <Icon
                  class="size-4!"
                  icon={copied ? "lucide:check" : "lucide:copy"}
                />
                {copied ? appText.v.btn.copySucessful : appText.v.btn.copy}
              </Button>
            </div>
            <div class="flex items-start gap-2">
              <Button
                class={cn(
                  "w-30 justify-around text-md transition-all",
                  openWord === null && "hidden",
                )}
                variant="outline"
                onclick={async () => {
                  if (!openWord?.saved) {
                    await db.insert(savedWords).values({
                      mainWriting: openWord?.mainWriting ?? "",
                      notes: "",
                    });
                  } else {
                    await db
                      .delete(savedWords)
                      .where(
                        eq(savedWords.mainWriting, openWord?.mainWriting ?? ""),
                      );
                  }
                  const updatedWord = await db.query.words.findFirst({
                    with: {
                      saved: true,
                      translations: true,
                    },
                    where: (words, { eq }) =>
                      eq(words.mainWriting, openWord?.mainWriting ?? ""),
                  });
                  console.log(updatedWord);
                  openWord = updatedWord || null;
                  savedPage.refreshWords();
                }}
              >
                <Icon
                  class="size-5!"
                  icon={openWord?.saved
                    ? "material-symbols:bookmark-rounded"
                    : "material-symbols:bookmark-outline-rounded"}
                />
                {openWord?.saved ? appText.v.btn.remove : appText.v.btn.save}
              </Button>
              {#if openWord?.saved}
                <EditNotes
                  bind:text={openWord.saved.notes}
                  hasNote={openWord.saved?.notes !== ""}
                  onSave={async () => {
                    await db
                      .update(savedWords)
                      .set({
                        notes: openWord?.saved?.notes,
                      })
                      .where(
                        eq(savedWords.mainWriting, openWord?.mainWriting ?? ""),
                      );
                    openWord =
                      (await db.query.words.findFirst({
                        with: { saved: true, translations: true },
                        where: (words, { eq }) =>
                          eq(words.mainWriting, openWord?.mainWriting ?? ""),
                      })) || null;
                  }}
                />
              {/if}
            </div>
            <div class="flex gap-1">
              {#each openWord?.mainKanjis ?? [] as k}
                <Button
                  class="size-12 rounded-md bg-pink-900 hover:bg-pink-600 text-xl kanji-font"
                  variant="secondary"
                  onclick={async () => {
                    const kanji = await db.query.kanjis.findFirst({
                      with: {
                        saved: true,
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
          <div class="flex flex-col gap-2 justify-center">
            {#if openWord?.translations.length ?? 0 > 0}
              <Badge variant="outline">
                {appText.v.badge.meanings}
              </Badge>
              <div
                class="w-70 h-24 p-2 border-2 border-pink-800/40 rounded-md text-xl max-w-70 overflow-x-hidden overflow-y-auto scrollbar break-normal wrap-break-word"
              >
                {#each openWord?.translations?.[0]?.meanings ?? [] as meaning}
                  <p class="pb-1 border-b-pink-400 border-b-1">
                    {meaning}
                  </p>
                {/each}
              </div>
            {/if}

            {#if openWord?.variants?.length ?? 0 > 0}
              <Badge variant="outline">
                {appText.v.badge.variants}
              </Badge>
            {/if}
            <div
              class="w-70 h-24 border-2 border-pink-800/40 rounded-md overflow-x-hidden overflow-y-auto scrollbar"
            >
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
            <div class="flex flex-col gap-2">
              {#if (openWord?.saved?.notes.length ?? 0) > 0}
                <Badge variant="outline">
                  <Label class="text-xl">{appText.v.badge.notes}:</Label>
                </Badge>
                <p
                  class="w-auto p-2 bg-pink-500/15 rounded-md whitespace-break-spaces"
                >
                  {openWord?.saved?.notes}
                </p>
              {/if}
            </div>
            <!-- <Label -->
            <!--   class="text-2xl max-w-96 kanji-font break-normal wrap-break-word" -->
            <!-- > -->
            <!---->
            <!--   {openWord?.variants?.map(v => v.writing).join(", ")} -->
            <!-- </Label> -->
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
