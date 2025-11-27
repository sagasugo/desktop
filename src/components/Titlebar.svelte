<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { Button, Label } from "@/lib/components";
  import Icon from "@iconify/svelte";
  import { useSidebar } from "@/lib/components/ui/sidebar";
  import { cn } from "@/lib/utils";
  import { page } from "$app/state";
  import { titleCase } from "@/utils";
  import { appFont, appText } from "@/states";

  const window = getCurrentWindow();
  const sidebar = useSidebar();

  const titleByPage = $derived({
    "/kana": appText.v.page.kana,
    "/kanji": appText.v.page.kanji,
    "/word": appText.v.page.word,
    "/saved": appText.v.page.saved,
    // only satisfying the compiler as all compiler slaves
    "": "title",
    "/": "title",
  });
</script>

<div
  class="h-10 w-full p-0.5 flex justify-between bg-background z-80 pointer-events-auto"
  data-tauri-drag-region
>
  <div class="flex gap-2">
    <Button
      class="size-9 rounded-md pointer-events-auto"
      variant="ghost"
      onclick={_ => sidebar.toggle()}
    >
      <Icon
        class={cn(
          "size-6! text-primary! transition-all duration-500",
          !sidebar.open && "-rotate-180",
        )}
        icon="lucide:panel-right-open"
      />
    </Button>
    <Button
      class="h-9 rounded-md pointer-events-auto"
      variant="ghost"
      onclick={() => appFont.nextFont()}
      ><p class="kanji-font text-xl">書</p>
      {appText.v.btn.font}: {appFont.font}</Button
    >
  </div>
  <Label class="text-xl text-primary" data-tauri-drag-region
    >{titleByPage[page.route.id ?? ""]}</Label
  >
  <div
    class="flex [&>*]:size-9 [&>*]:rounded-md [&>*]:text-primary! [&>*]:hover:text-primary/70! [&>*]:pointer-events-auto"
  >
    <Button variant="ghost" onclick={_ => window.minimize()}>
      <Icon class="size-6!" icon="lucide:minus" />
    </Button>
    <Button
      variant="ghost"
      onclick={async _ =>
        (await window.isMaximized()) ? window.unmaximize() : window.maximize()}
    >
      <Icon class="size-5!" icon="lucide:square" />
    </Button>
    <Button variant="ghost" onclick={_ => window.close()}>
      <Icon class="size-6!" icon="lucide:x" />
    </Button>
  </div>
</div>
