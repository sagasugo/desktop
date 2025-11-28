<script lang="ts">
  import { Button, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { kanaPage, selectedKanaP } from "@/states";
  import type { Kana } from "@/type";

  const { kana }: { kana: Kana } = $props();
</script>

<Button
  class={cn(
    "h-24 flex-col gap-0 rounded-md transition-all duration-500 [&_*]:cursor-pointer border-pink-900 hover:bg-pink-800",
    !kanaPage.showRomaji && "h-18",
  )}
  variant="outline"
  onclick={() => (selectedKanaP.value = kana)}
>
  <Label class="text-4xl kanji-font transition-all duration-500">
    {kana.literal}
  </Label>
  <Label
    class={cn(
      "text-xl transition-all duration-500",
      !kanaPage.showRomaji && "h-0 opacity-0 translate-y-2",
    )}
  >
    {kana.romaji}
  </Label>
</Button>
