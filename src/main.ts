import { Plugin } from "obsidian";
import { IconService } from "services/icon.service";
import { ProcessorService } from "services/processor.service";
import { RibbonService } from "services/ribbon.service";
import DnDCharacterSheetPluginSettingTab, { DEFAULT_SETTINGS, DnDCharacterSheetPluginSettings } from "settings";


export default class DnDCharacterSheetPlugin extends Plugin {
	#iconService = new IconService(this)
	#ribbonService = new RibbonService(this)
	#processor = new ProcessorService(this)
	settings: DnDCharacterSheetPluginSettings = {
		language: 'en',
		icons: 'default'
	}

	async onload(): Promise<void> {
		await this.loadSettings()
		this.#setup()
	}

	#setup() {
		this.addSettingTab(new DnDCharacterSheetPluginSettingTab(this.app, this))
		this.#iconService.registerIcons()
		this.#ribbonService.initialize()
		this.#processor.initialize()
	}

	async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

}