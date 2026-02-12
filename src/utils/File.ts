import { App, TFile } from "obsidian";

export class FileUtils {
  #app: App
  constructor(app: App) {
    this.#app = app
  }

  getAllFilesWithTag(tags: string[]): TFile[] {
    const files = this.#app.vault.getMarkdownFiles();
    return files.filter(file => {
      const cache = this.#app.metadataCache.getFileCache(file);
      if (!cache?.frontmatter?.tags) return false;

      const fileTags = cache.frontmatter.tags;

      if (Array.isArray(fileTags)) {
        return fileTags.some(x => tags.includes(x));
      }

      if (typeof fileTags === "string") {
        return tags.includes(fileTags);
      }

      return false;
    });
  }

  createFullPathLink(file: TFile): string {
    return `[[${file.path} | ${file.basename}]]`;
  }
}
