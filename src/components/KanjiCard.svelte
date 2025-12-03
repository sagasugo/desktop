<script lang="ts">
  import { db } from "@/db/client";
  import { Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { kanjiPage, selectedItem } from "@/states";
  import type { Kanji } from "@/type";
  import { toKatakana } from "wanakana";

  let {
    kanji: k,
  }: {
    kanji: Kanji;
  } = $props();

  let updatedKanji: Kanji | null = $state(null);
</script>

<button
  class={cn(
    "w-[100px] min-w-[100px] h-45 gap-2 border-2 text-primary hover:text-primary/90",
    "flex flex-col justify-center items-center py-2 transition-all duration-300 select-none rounded-md [&>*]:cursor-pointer",
    kanjiPage.compareMode
      ? "border-secondary hover:bg-secondary/50"
      : "border-pink-900 hover:bg-pink-800",
    (selectedItem.matchKanji(k.kanji) ||
      kanjiPage.comparedKanjis.find(kn => kn.kanji === k.kanji)) &&
      "border-pink-900 bg-pink-500 hover:bg-pink-800",
  )}
  onclick={async () => {
    if (!kanjiPage.compareMode) {
      if (!updatedKanji) {
        selectedItem.value =
          (await db.query.kanjis.findFirst({
            with: { saved: true, meanings: true },
            where: (kanjis, { eq }) => eq(kanjis.kanji, k.kanji),
          })) || null;
      } else {
        selectedItem.value = updatedKanji;
      }
      updatedKanji = null;
    } else {
      if (kanjiPage.comparedKanjis.find(kn => kn.kanji === k.kanji)) {
        kanjiPage.comparedKanjis = kanjiPage.comparedKanjis.filter(
          kn => kn.kanji !== k.kanji,
        );
      } else {
        kanjiPage.comparedKanjis.push(k);
      }
    }
  }}
  onmouseenter={async () => {
    updatedKanji =
      (await db.query.kanjis.findFirst({
        with: { saved: true, meanings: true },
        where: (kanjis, { eq }) => eq(kanjis.kanji, k.kanji),
      })) || null;
  }}
  onmouseleave={() => {
    updatedKanji = null;
  }}
>
  <p
    class="w-[80px] min-w-0 font-medium text-md overflow-hidden text-center line-clamp-2 break-words"
  >
    {k.meanings?.[0]?.keyword?.trim()}
  </p>
  <Label class="hover:text-primary! text-3xl kanji-font z-10">
    {k.kanji}
  </Label>
  {#if k.mainOnReading}
    <Label class="kanji-font">
      {toKatakana(k.mainOnReading)}
    </Label>
  {/if}
  {#if k.mainKunReading}
    <Label class="kanji-font">
      {k.mainKunReading}
    </Label>
  {/if}
</button>
