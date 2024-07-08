import { Scene } from "phaser";
import BG from "@assets/img/bg.jpg";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", BG);
  }

  create() {
    this.scene.start("Preloader");
  }
}
