<script lang="ts">
  import { Button, Drawer, Label } from "@/lib/components";
  import { selectedWord } from "@/states";

  let open = $state(false);

  $effect(() => {
    if (selectedWord.w !== null) {
      open = true;
    }
  });
</script>

<Drawer.Root
  bind:open
  onOpenChange={(open) => {
    if (!open) selectedWord.w = null;
  }}
>
  <Drawer.Content class="h-[85vh] text-primary items-center">
    <div class="flex gap-10">
      <Label class="text-[10rem]">{selectedWord.w?.mainWriting}</Label>
      <div class="flex flex-col justify-center">
        <Label class="text-2xl max-w-70 break-normal wrap-break-word">
          {selectedWord.w?.translations?.[0]?.meanings?.join(",")}
        </Label>
        <Label class="text-2xl max-w-96 break-normal wrap-break-word">
          {selectedWord.w?.variants?.map((v) => v.reading).join(", ")}
        </Label>
        <Label class="text-2xl max-w-96 break-normal wrap-break-word">
          {selectedWord.w?.mainKanjis?.join(", ")}
        </Label>
      </div>
    </div>
  </Drawer.Content>
</Drawer.Root>
