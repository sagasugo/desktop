<script lang="ts">
  import { themeMode } from "@/states";
  import { Sidebar, Button } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import Icon from "@iconify/svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
</script>

<Sidebar.Root class="select-none">
  <Sidebar.Header>
    <Button
      class=" items-center gap-3"
      variant="outline"
      onclick={themeMode.toggle}
    >
      {themeMode.value === "dark" ? "Light mode" : "Dark mode"}
      <div class="h-full parent flex items-center">
        <Icon
          class={cn(
            "absolute !size-6 transition-all duration-500 rotate-180 opacity-0 scale-0",
            themeMode.value === "light" && "rotate-0 opacity-100 scale-100",
          )}
          icon="material-symbols:sunny-rounded"
        />
        <Icon
          class={cn(
            "absolute !size-6 transition-all duration-500 -rotate-180 opacity-0 scale-0",
            themeMode.value === "dark" && "rotate-0 opacity-100 scale-100",
          )}
          icon="material-symbols:dark-mode"
        />
      </div>
    </Button>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.Menu class="[&>*]:text-bold [&>*]:text-xl [&>*]:justify-center">
        <Sidebar.MenuButton
          variant={page.url.pathname === "/kanji" ? "outline" : "default"}
          onclick={() => goto("/kanji")}
        >
          Kanji 漢字
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/discover")}>
          Word 言葉
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/kanji")}>
          Compare 比較
        </Sidebar.MenuButton>
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
</Sidebar.Root>
