<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { Button, Label } from "@/lib/components";
  import Icon from "@iconify/svelte";
  import { useSidebar } from "@/lib/components/ui/sidebar";
  import { cn } from "@/lib/utils";
  import { page } from "$app/state";
  import { titleCase } from "@/utils";

  const window = getCurrentWindow();
  const sidebar = useSidebar();
</script>

<div class="flex justify-between h-16 w-full p-2" data-tauri-drag-region>
  <Button class="w-9" variant="ghost" onclick={(_) => sidebar.toggle()}>
    <Icon
      class={cn(
        "size-6! text-primary! transition-all duration-500",
        !sidebar.open && "-rotate-180",
      )}
      icon="lucide:panel-right-open"
    />
  </Button>
  <Label class="text-xl text-primary" data-tauri-drag-region
    >{titleCase(page.route.id?.replace("/", ""))}</Label
  >
  <div class="flex [&>*]:w-9 [&>*]:text-primary! [&>*]:hover:text-primary/70!">
    <Button variant="ghost" onclick={(_) => window.minimize()}>
      <Icon class="size-6!" icon="lucide:minus" />
    </Button>
    <Button
      variant="ghost"
      onclick={async (_) =>
        (await window.isMaximized()) ? window.unmaximize() : window.maximize()}
    >
      <Icon class="size-5!" icon="lucide:square" />
    </Button>
    <Button variant="ghost" onclick={(_) => window.close()}>
      <Icon class="size-6!" icon="lucide:x" />
    </Button>
  </div>
</div>
