<script lang="ts">
  import { Button } from "@/lib/components";
  import { kanjiShowed } from "@/states";

  let {
    kanji,
  }: {
    kanji: {
      radical: string;
      furigana: string;
      meaning: string[];
      jlpt: string;
      readings: string[];
      phrases: string[];
    };
  } = $props();
</script>

<Button
  class="flex flex-col py-6 transition-all duration-500 hover:scale-125"
  variant="secondary"
  onclick={() => kanjiShowed.set(kanji)}
>
  <span class="text-3xl">
    {kanji.radical}
  </span>
</Button>
