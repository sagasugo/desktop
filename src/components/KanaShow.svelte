<script lang="ts">
  import { db } from "@/db/client";
  import { writeText } from "@tauri-apps/plugin-clipboard-manager";
  import { Badge, Button, Dialog, Drawer, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { appText, selectedItem, selectedKanaP, speech } from "@/states";
  import type { Kana, Kanji, Word } from "@/type";
  import Icon from "@iconify/svelte";
  import { hiraganas, katakanas, particles } from "@/constants";

  const relatedParticles = $derived(
    selectedKanaP.value !== null
      ? particles.filter(p =>
          p.literal.includes(selectedKanaP.value?.literal ?? ""),
        )
      : [],
  );
</script>

<Dialog.Root
  open={selectedKanaP?.value !== null}
  onOpenChangeComplete={open => {
    if (!open) {
    }
  }}
>
  <Dialog.Content
    class="h-140 flex flex-col justify-center items-center text-primary"
    onInteractOut={() => {
      selectedKanaP.value = null;
    }}
  >
    {#if selectedKanaP.value !== null}
      <Label class="text-3xl">
        {selectedKanaP.value.romaji}
      </Label>
      <Label class="text-[8rem] kanji-font">
        {selectedKanaP.value.literal}
      </Label>
      <Badge>
        <Label class="text-lg"
          >{appText.v.badge.stroke} {selectedKanaP.value.strokeCount}</Label
        >
      </Badge>
      {#if relatedParticles.length > 0}
        <div class="flex flex-col gap-1">
          <Badge variant="outline">
            {appText.v.badge.particles}
          </Badge>
          <div
            class="w-70 h-24 p-2 border-2 border-pink-800/40 rounded-md text-xl max-w-70 overflow-x-hidden overflow-y-auto scrollbar break-normal wrap-break-word"
          >
            {#each relatedParticles as particle}
              <p class="pb-1 border-b-pink-400 border-b-1">
                {particle.literal} - {particle.use}
              </p>
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </Dialog.Content>
</Dialog.Root>
