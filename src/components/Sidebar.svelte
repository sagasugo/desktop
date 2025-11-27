<script lang="ts">
  import { appText, themeMode } from "@/states";
  import { Sidebar, Label } from "@/lib/components";
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
        class="parent [&>*]:z-20 [&_*]:text-xl! [&_*]:cursor-pointer"
      >
        <Sidebar.MenuButton
          class={cn(
            "absolute max-w-31.5 z-10 pointer-events-none transition-all duration-300",
            page.url.pathname === "/kanji" && "translate-y-9",
            page.url.pathname === "/word" && "translate-y-18",
            page.url.pathname === "/saved" && "translate-y-27",
          )}
          variant="outline"
        ></Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/kana")}>
          <Icon class="size-6! -ml-1" icon="uil:letter-japanese-a" />
          <Label>{appText.v.page.kana}</Label>
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/kanji")}>
          <Icon class="size-7.5! -ml-2" icon="mdi:ideogram-cjk" />
          <Label class="-ml-1">{appText.v.page.kanji}</Label>
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/word")}>
          <b class="-ml-1">言</b>
          <Label>{appText.v.page.word}</Label>
        </Sidebar.MenuButton>
        <Sidebar.MenuButton onclick={() => goto("/saved")}>
          <Icon
            class="size-6! -ml-1"
            icon="material-symbols-light:bookmarks-rounded"
          />
          <Label>{appText.v.page.saved}</Label>
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
        <Label class="cursor-pointer text-nowrap">{appText.v.btn.theme}</Label>
      </Sidebar.MenuButton>
      <Sidebar.MenuButton
        class="items-center gap-3"
        onclick={appText.switchLanguage}
      >
        <Icon class="size-6! -ml-1" icon="ion:language" />
        <Label class="cursor-pointer text-nowrap">{appText.languageLabel}</Label
        >
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
