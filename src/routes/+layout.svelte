<script lang="ts">
  import "@/app.css";
  import "@fontsource-variable/noto-sans-jp";
  import "@fontsource-variable/noto-serif-jp";
  import "@fontsource/kiwi-maru";
  import "@fontsource/klee-one";
  import "@fontsource/yuji-mai";
  import "@fontsource/dotgothic16";
  import "@fontsource/reggae-one";
  import { cn } from "@/lib/utils";
  import { appFont, speech, themeMode } from "@/states";
  import { KanaShow, KanjiCompare, KanjiWordShow, Sidebar } from "@/components";
  import { Sidebar as SidebarProv } from "@/lib/components";
  import Titlebar from "@/components/Titlebar.svelte";
  import { onMount } from "svelte";
  import { checkDataset } from "@/core";

  let { children } = $props();
  onMount(() => {
    checkDataset();
    speech.checkAvailable();
  });
</script>

<KanaShow />
<KanjiCompare />
<KanjiWordShow />
<div
  data-theme="crimson"
  class={cn(
    "w-screen h-screen fontroot overflow-hidden flex bg-background",
    themeMode.value,
  )}
  style="--appfont: {appFont.font}"
>
  <SidebarProv.Provider>
    <Sidebar />
    <!-- <SidebarProv.Inset> -->
    <div class="w-full flex flex-col">
      <Titlebar />
      {@render children?.()}
    </div>
    <!-- </SidebarProv.Inset> -->
  </SidebarProv.Provider>
</div>

<style>
  .kanji-font :global(*) {
    font-family:
      var(--appFont), "Klee One", "Noto Sans JP", "Yuji Mai", "Kiwi Maru",
      "Noto Serif JP", "-apple-system", "system-ui";
  }
</style>
