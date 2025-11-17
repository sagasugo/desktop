<script lang="ts">
  import { Button, Drawer, Label } from "@/lib/components";
  import { selectedKanji } from "@/states";
</script>

<Drawer.Root
  open={selectedKanji.k !== null}
  onOpenChange={(open) => {
    if (!open) selectedKanji.k = null;
  }}
>
  <Drawer.Content class="h-90 text-primary items-center">
    <div class="flex gap-10">
      <Label class="text-[10rem]">{selectedKanji.k?.kanji}</Label>
      <div class="flex flex-col justify-center">
        <Label class="text-2xl max-w-96 break-normal wrap-break-word">
          {selectedKanji.k?.onReadings?.join(", ")}
        </Label>
        <Label class="text-2xl max-w-96 break-normal wrap-break-word">
          {selectedKanji.k?.kunReadings?.join(", ")}
        </Label>
        <Label class="text-2xl max-w-70 break-normal wrap-break-word">
          {selectedKanji.k?.meanings?.[0].meanings?.join(", ")}
        </Label>
      </div>
    </div>
  </Drawer.Content>
</Drawer.Root>
