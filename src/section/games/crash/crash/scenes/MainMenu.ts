import { GameObjects, Scene } from "phaser";
import { EventBus } from "../../EventBus";

export class MainMenu extends Scene {
  background: GameObjects.Image | null = null;
  rocketGroup: GameObjects.Container | null = null;
  beforeRocket: GameObjects.Image | null = null;
  rocket: GameObjects.Container | null = null;
  rocketBody: GameObjects.Image | null = null;
  fire: GameObjects.Image | null = null;
  crashOut: GameObjects.Text | null = null;
  logoTween: Phaser.Tweens.Tween | null = null;
  duration: number = 360;
  retime: number = 0;
  startedAt: Date | null = null;

  constructor() {
    super("MainMenu");
  }

  create() {
    const width = Number(this.sys.game.config.width);
    const height = Number(this.sys.game.config.height);

    this.background = this.add.image(width / 2, height / 2, "background");

    this.rocketGroup = this.add.container();
    this.rocket = this.add.container();

    this.fire = this.add.image(0, 0, "fire").setOrigin(1, 0.5).setAlpha(0.8);
    this.tweens.add({
      targets: this.fire,
      duration: 60,
      scaleX: 0.7,
      repeat: -1,
      yoyo: true,
    });

    this.rocketBody = this.add.image(0, 0, "rocket").setOrigin(0, 0.5);

    this.rocket
      .add(this.fire)
      .add(this.rocketBody)
      .setScale(0.3)
      .setPosition(110, -30);

    this.tweens.add({
      targets: this.rocket,
      x: 250,
      duration: 800,
      delay: 4700,
      repeat: 0,
    });

    this.beforeRocket = this.add.image(0, 0, "preRocket").setOrigin(0, 0.95);

    this.rocketGroup
      .add(this.rocket)
      .add(this.beforeRocket)
      .setPosition(-200, height);

    this.tweens.add({
      targets: this.rocketGroup,
      x: 50,
      duration: 2000,
      repeat: 0,
    });

    this.tweens.add({
      targets: this.rocketGroup,
      x: -100,
      duration: 1000,
      delay: 3000,
      repeat: 0,
    });

    this.tweens.add({
      targets: this.rocketGroup,
      angle: -5,
      duration: 400,
      delay: 4300,
      ease: "Power1",
      repeat: 0,
      yoyo: true,
    });

    this.tweens.add({
      targets: this.rocketGroup,
      x: -200,
      duration: 800,
      delay: 4700,
      repeat: 0,
    });

    this.crashOut = this.add
      .text(width / 2, height / 2, `10:00`, {
        font: "bold 48px Manrope",
        color: "black",
        align: "center",
        stroke: "#fff",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.retime = this.duration;

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    if (this.retime > 0) {
      this.retime -= 1;
      const second = Math.floor(this.retime / 60).toFixed(0);
      const ms = ((this.retime % 60) * 60) / 60;
      let msText;
      if (ms < 10) {
        msText = "0" + ms;
      } else {
        msText = ms;
      }
      this.crashOut?.setText(second + ":" + msText);
    }
  }

  changeScene() {
    const data = {
      startedAt: this.startedAt,
    };
    this.scene.start("Game", data);
  }

  setTime(time: Date) {
    this.startedAt = time;
  }
}
