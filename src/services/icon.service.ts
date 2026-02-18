import { addIcon, Plugin } from "obsidian";

export class IconService {
  #plugin: Plugin
  constructor(plugin: Plugin) {
    this.#plugin = plugin
  }

  public registerIcons() {
    addIcon('add-character-sheet', 'assets/icons/add-sheet-icon.svg')
  }

  public getSourcePathForClassIcon(className: string) {
    const path = this.#plugin.manifest.dir
    if (path && className) {
      return this.#plugin.app.vault.adapter.getResourcePath(`${path}/src/assets/icons/classes/default/${className}.symbol.svg`)
    }
    return ''
  }
}