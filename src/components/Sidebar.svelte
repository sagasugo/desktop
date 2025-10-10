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
      <Sidebar.Menu>
        <Sidebar.MenuButton
          class="text-bold text-xl justify-between"
          variant={page.url.pathname === "/discover" ? "outline" : "default"}
          onclick={() => goto("/discover")}
        >
          Discover
          <Icon
            class="!size-6"
            icon={page.url.pathname === "/discover"
              ? "line-md:compass-filled-loop"
              : "line-md:compass"}
          />
        </Sidebar.MenuButton>
        <Sidebar.MenuButton
          class="text-bold text-xl justify-between"
          onclick={() => goto("/discover")}
        >
          Saved
          <Icon
            class="!size-6"
            icon={"material-symbols:book-2-outline-rounded"}
          />
        </Sidebar.MenuButton>
        <Sidebar.MenuButton
          class="text-bold text-xl justify-between"
          onclick={() => goto("/discover")}
        >
          Cards
          <Icon class="!size-6" icon="mdi:cards-playing-outline" />
        </Sidebar.MenuButton>
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
</Sidebar.Root>
