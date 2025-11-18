<script lang="ts">
  import "@/app.css";
  import { cn } from "@/lib/utils";
  import { themeMode } from "@/states";
  import { KanjiShow, Sidebar, WordShow } from "@/components";
  import { Sidebar as SidebarProv } from "@/lib/components";
  import Titlebar from "@/components/Titlebar.svelte";
  import { onMount } from "svelte";
  import { checkDataset } from "@/setup";

  let { children } = $props();
  onMount(() => {
    checkDataset();
  });
</script>

<KanjiShow />
<WordShow />
<div
  data-theme="cerberus"
  class={cn(
    themeMode.value,
    "w-screen h-screen overflow-hidden flex bg-background",
  )}
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
