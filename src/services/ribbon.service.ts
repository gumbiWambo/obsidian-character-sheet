import { Plugin, TFile } from "obsidian";

export class RibbonService {
  #plugin: Plugin
  constructor(plugin: Plugin) {
    this.#plugin = plugin
  }

  initialize() {
    this.#plugin.addRibbonIcon('user-pen', 'create character', async (event: MouseEvent) => {
      await this.#addNewCharacterSheet()
		})
  }
  
  async #addNewCharacterSheet() {
    const vault = this.#plugin.app.vault
    const fileName = this.#getNewFileName()
    await vault.create(fileName, this.#getStandardFile())
    const filePath: TFile | null = vault.getFileByPath(fileName)
    this.#plugin.app.workspace.getLeaf('tab').openFile(filePath as TFile)
  }

  #getNewFileName(): string {
    const vault = this.#plugin.app.vault
    let newFileName = `unnamed.character.md`
    const defaultExists = vault.getFileByPath(newFileName)
    if (defaultExists) {
      let i = 1;
      while (vault.getFileByPath(newFileName)) {
        newFileName = `unnamed.character${i}.md`
        ++i;
      }
    }
    return `./${newFileName}`
  }

  #getStandardFile(): string {
    return `\`\`\`character
      name: Unnamed Character
      classes:
      - name: Class
        level: 0
        subclass: Subclass
      background: Background
      stats: [0, 0, 0, 0, 0, 0]
      expertise:
      - Example
      proficiencies:
      - Example
\`\`\`
`
  }
}