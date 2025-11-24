<script lang="ts">
  import { Drawer as DrawerPrimitive } from "vaul-svelte";
  import DrawerOverlay from "./drawer-overlay.svelte";
  import { cn } from "$lib/utils.js";
  import { appFont, themeMode } from "@/states";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    ...restProps
  }: DrawerPrimitive.ContentProps & {
    portalProps?: DrawerPrimitive.PortalProps;
  } = $props();
</script>

<DrawerPrimitive.Portal {...portalProps}>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    bind:ref
    onInteractOutside={e => {
      let el = e?.target as HTMLElement | null;
      if (
        el?.tagName === "BUTTON" ||
        el?.hasAttribute("data-tauri-drag-region")
      )
        e.preventDefault();
    }}
    data-slot="drawer-content"
    class={cn(
      "group/drawer-content bg-background/70 backdrop-blur-sm fixed z-50 flex h-auto flex-col",
      "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
      "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
      "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
      "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
      themeMode.value,
      className,
    )}
    {...restProps}
    style="--appfont: {appFont.font}"
  >
    <div
      class="bg-muted mx-auto mt-4 mb-8 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
    ></div>
    {@render children?.()}
  </DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
