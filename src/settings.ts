import DnDCharacterSheetPlugin from "main";
import { App, Notice, PluginSettingTab, Setting } from "obsidian";

export default class DnDCharacterSheetPluginSettingTab extends PluginSettingTab {

  #plugin: DnDCharacterSheetPlugin

  constructor(app: App, plugin: DnDCharacterSheetPlugin) {
    super(app, plugin)
    this.#plugin = plugin
  }

  display(): void {
    try {
      this.#prepareContainer()
      this.generateGeneralSettings(this.containerEl.createDiv())
    } catch (error) {
      console.error(error)
      new Notice("There was an error displaying the settings tab for DnD Character Sheet.")
    }

  }

  #prepareContainer() {
    this.containerEl.empty()
    this.containerEl.addClass("dnd-character-sheet-settings")
    this.containerEl.createEl("h2", { text: "DnD Character Sheet Settings" })
  }

  generateGeneralSettings(container: HTMLDivElement) {
    container.empty();
    new Setting(container).setHeading().setName("Gerneral Settings")
    new Setting(container)
      .setName("Language")
      .setDesc(createFragment((element) => {
        element.createSpan({ text: "This will set the language " })
      })).addDropdown(dropdown => {
        dropdown.addOption("en", "English")
        dropdown.addOption("de", "Deutsch")
        dropdown.setValue(this.#plugin.settings.language)
        dropdown.onChange(async (value) => {
          this.#plugin.settings.language = value
          this.#plugin.saveSettings()
        })
      })

    new Setting(container)
      .setName("Icons")
      .setDesc(createFragment((element) => {
        element.createSpan({ text: "This will set icons that will be used" })
      })).addDropdown(dropdown => {
        dropdown.addOption("default", "Default")
        dropdown.addOption("max", "Max")
        dropdown.setValue(this.#plugin.settings.language)
        dropdown.onChange(async (value) => {
          this.#plugin.settings.icons = value
          this.#plugin.saveSettings()
        })
      })

  }
}

export interface DnDCharacterSheetPluginSettings {
  language: string,
  icons: string
}

export const DEFAULT_SETTINGS = {
  language: 'en',
  icons: 'default'
}