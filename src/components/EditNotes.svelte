<script lang="ts">
  import { Button, Dialog, Input, Popover, Textarea } from "@/lib/components";
  import { appText } from "@/states";
  import Icon from "@iconify/svelte";

  type Props = {
    text?: string;
    hasNote: boolean;
    onSave: VoidFunction;
  };

  let { text = $bindable(""), hasNote, onSave }: Props = $props();

  let backupText = "";
  let open = $state(false);
</script>

<Popover.Root
  bind:open
  onOpenChange={open => {
    if (open) {
      backupText = text;
    } else {
      backupText = "";
    }
  }}
>
  <Popover.Trigger
    ><Button>
      <Icon icon={hasNote ? "lucide:pen" : "lucide:plus"} />
      {hasNote ? appText.v.btn.editNote : appText.v.btn.addNote}
    </Button>
  </Popover.Trigger>
  <Popover.Content
    class="flex flex-col justify-around items-stretch gap-2"
    onInteractOutside={() => {
      text = backupText;
      open = false;
    }}
  >
    <Textarea bind:value={text} />
    <div class="w-full flex justify-end gap-2 [&_svg]:size-4!">
      <Button
        variant="secondary"
        onclick={() => {
          text = backupText;
          open = false;
        }}
      >
        <Icon icon="lucide:x" />
        {appText.v.btn.cancel}
      </Button>
      <Button
        onclick={() => {
          onSave();
          open = false;
        }}
      >
        <Icon icon="lucide:check" />
        {appText.v.btn.save}
      </Button>
    </div>
  </Popover.Content>
</Popover.Root>
