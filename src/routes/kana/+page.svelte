<script lang="ts">
  import { KanaCard } from "@/components";
  import { hiraganas, katakanas } from "@/constants";
  import { Button, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import Icon from "@iconify/svelte";

  let kanaMode: "hiragana" | "katakana" = $state("hiragana");
  let isVertical = $state(false);
</script>

<div class="w-full h-full flex flex-col items-center gap-2">
  <div class="flex items-center gap-2">
    <div
      class="p-1 rounded-2xl relative select-none bg-secondary/50 font-medium [&>*]:rounded-xl [&_label]:z-10 [&_*]:cursor-pointer"
    >
      <Button
        class={cn(
          "w-23.5 absolute transition-all duration-500 pointer-events-none bg-background/80",
          kanaMode === "hiragana" ? "translate-0" : "translate-x-24.5",
        )}
        variant="outline"
      />
      <Button variant="ghost" onclick={() => (kanaMode = "hiragana")}>
        <Label>Hiragana</Label>
      </Button>
      <Button variant="ghost" onclick={() => (kanaMode = "katakana")}>
        <Label>Katakana</Label>
      </Button>
    </div>
    <Button variant="outline" onclick={() => (isVertical = !isVertical)}>
      <Icon
        class={cn("size-4! transition-all", isVertical && "rotate-90")}
        icon="material-symbols:table-rows-rounded"
      />
    </Button>
  </div>
  <div class="w-full h-full pt-2 overflow-y-scroll overflow-x-hidden scrollbar">
    <div class="w-full h-full flex justify-center relative">
      <div
        class={cn(
          "w-full  pb-4 flex justify-center absolute transition-all duration-500",
          kanaMode === "hiragana" ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          class={cn("flex gap-2", isVertical ? "overflow-x-auto" : "flex-col")}
        >
          {#each hiraganas as hiraganaRow}
            <div
              class={cn(
                "flex justify-between gap-2",
                isVertical && "flex-col pb-4",
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
          kanaMode === "katakana" ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div class={cn("flex gap-2", !isVertical && "flex-col")}>
          {#each katakanas as katakanaRow}
            <div
              class={cn("flex justify-between gap-2", isVertical && "flex-col")}
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
