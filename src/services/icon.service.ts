import DnDCharacterSheetPlugin from "main";
import { addIcon, getIcon, normalizePath, Plugin } from "obsidian";

export class IconService {
  #plugin: DnDCharacterSheetPlugin
  constructor(plugin: Plugin) {
    this.#plugin = plugin as DnDCharacterSheetPlugin
  }

  public async registerIcons() {
    const path = `${this.#plugin.manifest.dir}/src/assets/icons/classes/${this.#plugin.settings.icons}`
    const list = await this.#plugin.app.vault.adapter.list(path)
    const svgs = await Promise.all(list.files.map(async x => {
      const content = await this.#plugin.app.vault.adapter.read(x)
      return {
        name: x.split('/').pop()?.split('.')[0] ?? '',
        content
      }
    }))
    svgs.forEach(svg => {
      addIcon(svg.name, svg.content)
    })
  }

  public getSourcePathForClassIcon(className: string): string {
    const path = this.#plugin.manifest.dir
    if (path && className) {
      return this.#plugin.app.vault.adapter.getResourcePath(`${path}/src/assets/icons/classes/${this.#plugin.settings.icons}/${className}.symbol.svg`)
    }
    return ''
  }

  public async getShape(iconName: string): Promise<string> {
    const path = this.#plugin.manifest.dir
    if (path && iconName) {
      const resourcePath = `${path}/src/assets/shapes/${iconName}.svg`
      return await this.#plugin.app.vault.adapter.read(resourcePath);
    }
    return ''
  }
}