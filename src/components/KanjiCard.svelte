<script lang="ts">
  import { Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { selectedItem } from "@/states";
  import type { Kanji } from "@/type";

  let {
    kanji: k,
  }: {
    kanji: Kanji;
  } = $props();
</script>

<button
  class={cn(
    "w-[90px] min-w-[90px] flex flex-col gap-2 border-2 border-pink-900 hover:bg-pink-800 text-primary hover:text-primary/90",
    "flex flex-col items-center py-6 transition-all duration-300 select-none rounded-md [&>*]:cursor-pointer",
    selectedItem.matchKanji(k.kanji) && "bg-pink-500",
  )}
  onclick={() => {
    selectedItem.value = selectedItem.matchKanji(k.kanji) ? null : k;
  }}
>
  <p
    class="w-[80px] min-w-0 font-medium text-md overflow-hidden text-center break-words"
  >
    {k.meanings?.[0]?.keyword?.trim()}
  </p>
  <Label class="hover:text-primary! text-3xl kanji-font z-10">
    {k.kanji}
  </Label>
  <Label class="kanji-font">
    {k.mainOnReading ?? k.mainKunReading}
  </Label>
</button>
