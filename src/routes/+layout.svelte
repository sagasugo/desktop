<script lang="ts">
  import "@/app.css";
  import { cn } from "@/lib/utils";
  import { themeMode } from "@/states";
  import { Sidebar } from "@/components";
  import { Sidebar as SidebarProv } from "@/lib/components";

  let { children } = $props();
</script>

<div class={cn(themeMode.value, "w-screen h-screen flex bg-background")}>
  <SidebarProv.Provider>
    <Sidebar />
    <SidebarProv.Inset>
      {@render children?.()}
    </SidebarProv.Inset>
  </SidebarProv.Provider>
</div>
