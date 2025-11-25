import { DOWNLOAD_DATASET } from "@/constants";
import { db } from "@/db/client";
import { download } from "@tauri-apps/plugin-upload";
import { appConfigDir } from "@tauri-apps/api/path";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkDataset() {
  const result = await db.query.kanjis.findFirst();
  if (!result?.kanji) {
    await download(
      DOWNLOAD_DATASET,
      `${await appConfigDir()}/dataset.db`,
      ({ progress, total }) =>
        console.log(`Downloaded ${progress} of ${total} bytes`),
    );
    relaunch();
  }
}
