<script lang="ts">
  import { Button, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { appText, savedPage } from "@/states";
</script>

<div class="w-full h-full flex flex-col items-center gap-2">
  <div class="flex flex-col-reverse md:flex-row items-center gap-2">
    <div
      class="flex gap-1 p-1 rounded-2xl relative select-none bg-secondary/50 font-medium [&>*]:w-24 [&>*]:rounded-xl [&_label]:z-10 [&_*]:cursor-pointer"
    >
      <Button
        class={cn(
          "w-23.5 absolute transition-all duration-500 pointer-events-none bg-background/80",
          savedPage.mode === "kanji" ? "translate-0" : "translate-x-25",
        )}
        variant="outline"
      />
      <Button variant="ghost" onclick={() => (savedPage.mode = "kanji")}>
        <Label>{appText.v.page.kanji}s</Label>
      </Button>
      <Button variant="ghost" onclick={() => (savedPage.mode = "word")}>
        <Label>{appText.v.page.word}</Label>
      </Button>
    </div>
  </div>
</div>
<div
  class="w-full h-full pt-2 overflow-y-scroll overflow-x-hidden scrollbar-hide"
>
  <div class="w-full h-full flex justify-center relative">
    <div
      class={cn(
        "w-full  pb-4 flex justify-center absolute transition-all duration-500",
        savedPage.mode === "kanji" ? "translate-x-0" : "-translate-x-full",
      )}
    ></div>
  </div>
  <div class="w-full h-full flex justify-center relative">
    <div
      class={cn(
        "w-full  pb-4 flex justify-center absolute transition-all duration-500",
        savedPage.mode === "word" ? "translate-x-0" : "translate-x-full",
      )}
    ></div>
  </div>
</div>
