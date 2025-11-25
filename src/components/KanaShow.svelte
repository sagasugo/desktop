<script lang="ts">
  import { db } from "@/db/client";
  import { writeText } from "@tauri-apps/plugin-clipboard-manager";
  import { Badge, Button, Drawer, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { selectedItem, speech } from "@/states";
  import type { Kanji, Word } from "@/type";
  import Icon from "@iconify/svelte";

  let open = $state(false);
</script>

<Drawer.Root
  bind:open
  onOpenChangeComplete={open => {
    if (!open) {
      selectedItem.value = null;
      // history = [];
    }
  }}
>
  <Drawer.Content
    class="h-[65vh] data-[vaul-drawer-direction=bottom]:max-h-160 text-primary items-center"
  ></Drawer.Content></Drawer.Root
>
