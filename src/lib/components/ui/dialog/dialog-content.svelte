<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import XIcon from "@lucide/svelte/icons/x";
  import type { Snippet } from "svelte";
  import * as Dialog from "./index.js";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import { appFont, themeMode } from "@/states";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    showCloseButton = true,
    onOut,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: DialogPrimitive.PortalProps;
    children: Snippet;
    showCloseButton?: boolean;
    onOut?: VoidFunction;
  } = $props();
</script>

<Dialog.Portal {...portalProps}>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    bind:ref
    onInteractOutside={e => {
      let el = e?.target as HTMLElement | null;
      if (
        el?.tagName === "BUTTON" ||
        el?.hasAttribute("data-tauri-drag-region")
      ) {
        e.preventDefault();
      } else {
        onOut?.();
      }
    }}
    data-slot="dialog-content"
    class={cn(
      "bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
      themeMode.value,
      className,
    )}
    {...restProps}
    style="--appfont: {appFont.font}"
  >
    {@render children?.()}
    {#if showCloseButton}
      <DialogPrimitive.Close
        class="ring-offset-background text-primary focus:ring-ring rounded-xs focus:outline-hidden absolute end-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
        onclick={() => onOut?.()}
      >
        <XIcon />
        <span class="sr-only">Close</span>
      </DialogPrimitive.Close>
    {/if}
  </DialogPrimitive.Content>
</Dialog.Portal>
