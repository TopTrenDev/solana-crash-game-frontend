import { Scene } from "phaser";
import rocket from "@assets/img/rocket.png";
import bomb from "@assets/img/boom.png";
import fire from "@assets/img/fire.png";
import beforeRocket from "@assets/img/beforeRocket.png";
import path from "@assets/img/path.png";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    const width = Number(this.sys.game.config.width);
    const height = Number(this.sys.game.config.height);

    this.add.image(width / 2, height / 2, "background");
  }

  preload() {
    this.load.image("rocket", rocket);
    this.load.image("bomb", bomb);
    this.load.image("fire", fire);
    this.load.image("preRocket", beforeRocket);
    this.load.image("path", path);
  }

  create() {
    this.scene.start("MainMenu");
  }
}
