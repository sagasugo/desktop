<script lang="ts">
  import { db } from "@/db/client";
  import { Badge, Dialog, Label } from "@/lib/components";
  import { appText, kanjiPage, selectedItem, speech } from "@/states";
  import { toKatakana } from "wanakana";
</script>

<Dialog.Root
  open={kanjiPage.comparedKanjis.length === 2 && selectedItem.value === null}
  onOpenChange={open => {
    kanjiPage.compareMode = false;
    if (!open) {
      kanjiPage.comparedKanjis = [];
    }
  }}
  ><Dialog.Content class="sm:max-w-180 flex justify-around gap-2">
    {#each kanjiPage.comparedKanjis as k, j}
      <div
        class="w-1/2 h-full flex flex-col justify-between items-center gap-2"
      >
        <button
          class="text-[12rem] font-medium text-primary kanji-font"
          onclick={() => (selectedItem.value = k)}
        >
          {k.kanji}
        </button>
        <div class="h-full flex flex-col gap-2 justify-end items-center">
          <Badge class="text-md items-start" variant="outline">
            On yomi:
            <p class="text-xl max-w-50 kanji-font">
              {#each k?.onReadings ?? [] as onReading, i (i)}
                <button onclick={() => speech.speak(onReading)}>
                  {toKatakana(onReading)}
                </button>
                {(k?.onReadings?.length ?? 1) > 1 &&
                i + 1 < (k?.onReadings?.length ?? 1)
                  ? ","
                  : ""}
                {#if i === 2 || i == 4 || i === 6 || i === 8}
                  <br />
                {/if}
              {:else}
                -
              {/each}
            </p>
          </Badge>
          <Badge class="text-md items-start" variant="outline">
            Kun yomi:
            <p class="text-xl max-w-50 kanji-font">
              {#each k?.kunReadings ?? [] as kunReading, i (i)}
                <button onclick={() => speech.speak(kunReading)}>
                  {kunReading}
                </button>
                {(k?.kunReadings?.length ?? 1) > 1 &&
                i + 1 < (k?.kunReadings?.length ?? 1)
                  ? ","
                  : ""}
                {#if i === 2 || i == 4 || i === 6 || i === 8}
                  <br />
                {/if}
              {:else}
                -
              {/each}

              <!-- {openKanji?.kunReadings?.join(", ")} <br /> -->
            </p>
          </Badge>
          <div class="flex gap-2">
            <Badge>
              <Label class="text-lg"
                >{appText.v.badge.stroke} {k.strokeCount}</Label
              >
            </Badge>
            <Badge
              class="justify-between text-xl border-pink-400"
              variant="outline"
            >
              Radicals
              <p class="text-xl max-w-50 kanji-font">
                {#each k?.radicals ?? [] as radical, i (i)}
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
                  {(k?.radicals?.length ?? 1) > 1 &&
                  i + 1 < (k?.radicals?.length ?? 1)
                    ? ","
                    : ""}
                {:else}
                  -
                {/each}
              </p>
            </Badge>
          </div>
          <div class="flex gap-2">
            <Badge class="bg-pink-600" variant="secondary">
              <Label class="text-lg"
                >{k.jlpt ? `JLPT N${k?.jlpt}` : "Non JLPT"}</Label
              >
            </Badge>
            <Badge class="bg-red-800" variant="outline">
              <Label class="text-lg"
                >{k.grade ? `Grade ${k?.grade}` : "Non Grade"}</Label
              >
            </Badge>
          </div>
        </div>
      </div>
      {#if j === 0}
        <div class="w-2! h-140 rounded-xl bg-pink-950"></div>
      {/if}
    {/each}
  </Dialog.Content></Dialog.Root
>
