<script lang="ts">
  import { Button, Label } from "@/lib/components";
  import { toRomaji } from "wanakana";

  const { kana }: { kana: string } = $props();
</script>

<Button
  class="flex-col h-20 gap-0 rounded-md [&_*]:cursor-pointer"
  variant="outline"
>
  <Label class="text-4xl">
    {kana}
  </Label>
  <Label class="text-xl">
    {toRomaji(kana)}
  </Label>
</Button>
