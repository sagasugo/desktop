<script lang="ts">
  import { KanaCard } from "@/components";
  import { hiraganas, katakanas } from "@/constants";
  import { Button, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { kanaPage } from "@/states";
  import Icon from "@iconify/svelte";
</script>

<div class="w-full h-full flex flex-col items-center gap-2">
  <div class="flex items-center gap-2">
    <div
      class="flex gap-1 p-1 rounded-2xl relative select-none bg-secondary/50 font-medium [&>*]:rounded-xl [&_label]:z-10 [&_*]:cursor-pointer"
    >
      <Button
        class={cn(
          "w-23.5 absolute transition-all duration-500 pointer-events-none bg-background/80",
          kanaPage.kanaMode === "hiragana" ? "translate-0" : "translate-x-24.5",
        )}
        variant="outline"
      />
      <Button variant="ghost" onclick={() => (kanaPage.kanaMode = "hiragana")}>
        <Label>Hiragana</Label>
      </Button>
      <Button variant="ghost" onclick={() => (kanaPage.kanaMode = "katakana")}>
        <Label>Katakana</Label>
      </Button>
    </div>
    <Button
      variant="outline"
      onclick={() => (kanaPage.showRomaji = !kanaPage.showRomaji)}
    >
      Romaji
      <Icon
        class={cn(
          "size-4! transition-all duration-500",
          kanaPage.showRomaji && "-rotate-180",
        )}
        icon={kanaPage.showRomaji
          ? "material-symbols:visibility-outline-rounded"
          : "material-symbols:visibility-off-outline-rounded"}
      />
    </Button>
    <Button
      variant="outline"
      onclick={() => (kanaPage.isVertical = !kanaPage.isVertical)}
    >
      {kanaPage.isVertical ? "Vertical" : "Horizontal"}
      <Icon
        class={cn(
          "size-4! transition-all duration-300",
          kanaPage.isVertical && "rotate-90",
        )}
        icon="material-symbols:table-rows-rounded"
      />
    </Button>
  </div>
  <div
    class="w-full h-full pt-2 overflow-y-scroll overflow-x-hidden scrollbar-hide"
  >
    <div class="w-full h-full flex justify-center relative">
      <div
        class={cn(
          "w-full  pb-4 flex justify-center absolute transition-all duration-500",
          kanaPage.kanaMode === "hiragana"
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        <div
          class={cn(
            "flex gap-2",
            kanaPage.isVertical ? "overflow-x-auto scrollbar p-4" : "flex-col",
          )}
        >
          {#each hiraganas as hiraganaRow}
            <div
              class={cn(
                "flex justify-between gap-2",
                kanaPage.isVertical && "flex-col pb-8",
              )}
            >
              {#each hiraganaRow as hiragana}
                <KanaCard kana={hiragana} />
              {/each}
            </div>
          {/each}
        </div>
      </div>
      <div
        class={cn(
          "w-full pb-4 flex justify-center absolute transition-all duration-500",
          kanaPage.kanaMode === "katakana"
            ? "translate-x-0"
            : kanaPage.isVertical
              ? "translate-x-[150vw]"
              : "translate-x-full",
        )}
      >
        <div
          class={cn(
            "flex gap-2",
            kanaPage.isVertical ? "overflow-x-auto scrollbar p-4" : "flex-col",
          )}
        >
          {#each katakanas as katakanaRow}
            <div
              class={cn(
                "flex justify-between gap-2",
                kanaPage.isVertical && "flex-col pb-8",
              )}
            >
              {#each katakanaRow as katakana}
                <KanaCard kana={katakana} />
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
