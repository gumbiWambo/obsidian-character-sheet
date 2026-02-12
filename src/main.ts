import { Plugin } from "obsidian";
import { IconService } from "services/icon.service";
import { ProcessorService } from "services/processor.service";
import { RibbonService } from "services/ribbon.service";

export default class DnDCharacterSheetPlugin extends Plugin {
	#iconService = new IconService()
	#ribbonService = new RibbonService(this)
	#processor = new ProcessorService(this)

	onload(): Promise<void> | void {
		this.#setup()
	}

	#setup() {
		this.#iconService.registerIcons()
		this.#ribbonService.initialize()
		this.#processor.initialize()
	}


}