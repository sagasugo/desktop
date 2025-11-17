<script lang="ts">
  import { themeMode } from "@/states";
  import { Sidebar, Button, Label } from "@/lib/components";
  import { cn } from "@/lib/utils";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
</script>

<Sidebar.Root class="select-none" collapsible="icon">
  <Sidebar.Header></Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.Menu
        class="parent [&>*]:z-20  [&_*]:text-xl! [&_*]:cursor-pointer"
      >
        <Sidebar.MenuButton
          class={cn(
            "absolute max-w-31.5 z-10 pointer-events-none transition-all duration-300",
            page.url.pathname === "/word" && "translate-y-9",
            page.url.pathname === "/favorite" && "translate-y-18",
          )}
          variant="outline"
        ></Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/kanji")}>
          <Label class="-ml-0.5">漢</Label>
          <Label>Kanji</Label>
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/word")}>
          <Label class="-ml-0.5">言</Label>
          <Label>Word</Label>
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/favorite")}>
          <Icon class="size-6! -ml-1" icon="lucide:star" />
          <Label>Favorites</Label>
        </Sidebar.MenuButton>
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuButton class="items-center gap-3" onclick={themeMode.toggle}>
        <Icon
          class={cn(
            "!size-6 -ml-1 transition-all duration-500 rotate-0",
            themeMode.value === "light" && "-rotate-360",
          )}
          icon={themeMode.value === "light"
            ? "material-symbols:sunny-rounded"
            : "material-symbols:dark-mode"}
        />
        <Label class="cursor-pointer text-nowrap">Theme</Label>
      </Sidebar.MenuButton>
      <Sidebar.MenuButton>
        <img
          class="size-7 min-w-7 -m-1.5 object-contain"
          src="/favicon.png"
          alt="app's icon"
        />
        <Label class="ml-1.5 text-md cursor-pointer">SagaSugo!</Label>
      </Sidebar.MenuButton>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
