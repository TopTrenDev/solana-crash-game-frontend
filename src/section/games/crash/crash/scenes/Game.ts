import { GameObjects, Scene } from "phaser";
import { EventBus } from "../../EventBus";

export class Game extends Scene {
  background: GameObjects.Image | null = null;
  rocket: GameObjects.Container | null = null;
  rocketBody: GameObjects.Image | null = null;
  fire: GameObjects.Image | null = null;
  starTime: number = 0;
  height: number = 0;
  width: number = 0;
  x: number = 0;
  y: number = 0;
  angle: number = 90;
  duration: number = 0;
  path: GameObjects.Image | null = null;
  crashOut: GameObjects.Text | null = null;
  startedAt: Date | null = null;
  maskShape: GameObjects.Graphics | null = null;
  // tempMask: GameObjects.Graphics | null = null;
  player: GameObjects.Container | null = null;
  xAxis: GameObjects.Graphics | null = null;
  yAxis: GameObjects.Graphics | null = null;
  y1: GameObjects.Text | null = null;
  y2: GameObjects.Text | null = null;
  y3: GameObjects.Text | null = null;
  y4: GameObjects.Text | null = null;
  y5: GameObjects.Text | null = null;

  constructor() {
    super("Game");
  }

  init(data: any) {
    this.startedAt = data.startedAt;
  }

  create() {
    this.width = Number(this.sys.game.config.width);
    this.height = Number(this.sys.game.config.height);

    this.background = this.add.image(
      this.width / 2,
      this.height / 2,
      "background"
    );

    this.fire = this.add.image(0, 0, "fire").setOrigin(1, 0.5).setScale(1, 1.4);
    this.tweens.add({
      targets: this.fire,
      scaleX: 1.4,
      duration: 60,
      repeat: -1,
      yoyo: true,
    });

    this.rocketBody = this.add.image(0, 0, "rocket").setOrigin(0, 0.5);

    this.rocket = this.add
      .container(50, this.height - 40)
      .setDepth(100)
      .setScale(0.3);

    this.rocket.add(this.fire).add(this.rocketBody);

    this.tweens.add({
      targets: this.rocket,
      scale: 0.5,
      duration: 8000,
      repeat: 0,
      yoyo: false,
    });

    this.starTime = Date.now();

    this.path = this.add.image(62, this.height - 20, "path").setOrigin(0, 1);

    // this.tempMask = this.add
    //   .graphics()
    //   .fillStyle(0xfff)
    //   .fillRect(0, 0, this.width, 300)
    //   .setPosition(-this.width, this.height - 70)
    //   .setScale(1, 0);

    this.maskShape = this.make.graphics();
    this.maskShape
      .fillStyle(0xff0)
      .fillRect(0, 0, this.width, 300)
      .setPosition(-this.width, this.height - 70)
      .setScale(1, 0);

    const mask = this.maskShape.createGeometryMask();

    this.path.setMask(mask);

    this.crashOut = this.add
      .text(100, 100, `1.00x`, {
        font: "bold 48px Manrope",
        color: "black",
        align: "center",
        stroke: "#fff",
        strokeThickness: 2,
      })
      .setOrigin(0, 0.5)
      .setDepth(10);

    this.xAxis = this.add
      .graphics()
      .lineStyle(1, 0x000, 1)
      .moveTo(60, this.height - 28)
      .lineTo(900, this.height - 28)
      .strokePath();

    this.yAxis = this.add
      .graphics()
      .lineStyle(1, 0x000, 1)
      .moveTo(60, 30)
      .lineTo(60, this.height - 28)
      .strokePath();

    this.y1 = this.add
      .text(55, 50, "2.60x", {
        font: "bold 12px Manrope",
        color: "black",
        align: "center",
      })
      .setOrigin(1, 0.5);

    this.y2 = this.add
      .text(55, 50 + (this.height - 95) / 4, "2.20x", {
        font: "bold 12px Manrope",
        color: "black",
        align: "center",
      })
      .setOrigin(1, 0.5);

    this.y3 = this.add
      .text(55, 50 + ((this.height - 95) / 4) * 2, "1.80x", {
        font: "bold 12px Manrope",
        color: "black",
        align: "center",
      })
      .setOrigin(1, 0.5);

    this.y4 = this.add
      .text(55, 50 + ((this.height - 95) / 4) * 3, "1.40x", {
        font: "bold 12px Manrope",
        color: "black",
        align: "center",
      })
      .setOrigin(1, 0.5);

    this.y5 = this.add
      .text(55, this.height - 45, "1.00x", {
        font: "bold 12px Manrope",
        color: "black",
        align: "center",
      })
      .setOrigin(1, 0.5);

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    const elapsed = Date.now() - this.starTime;
    const growth = this.growthFunc(Math.pow(elapsed, 2.5) * 4);

    // const circle = this.add.circle(this.x, this.y, 3, 0xff0000, 1);
    // circle.setAlpha(1);
    // circle.setDepth(90);

    if (growth < this.height - 10) {
      // this.maskShape
      //   ?.setPosition(
      //     50 + elapsed / 10 - 0.02 * Math.pow(elapsed, 1.1) - this.width - 10,
      //     this.height - 30
      //   )
      //   .setScale(1, -growth / (this.height - 10));
      this.maskShape
        ?.setPosition(
          55 + elapsed / 10 - 0.02 * Math.pow(elapsed, 1.1) - this.width - 10,
          this.height - 30
        )
        .setScale(1, -(growth - 60) / (this.height - 100));
    }

    if (growth < this.height - 60) {
      this.x = 50 + elapsed / 10 - 0.02 * Math.pow(elapsed, 1.1);
      this.y = this.height - growth + 70;

      this.angle =
        Math.atan(
          (-this.growthFunc(Math.pow(elapsed + 890, 2.5) * 4.17) + growth) /
            4000
        ) * 2400;
    }

    this.rocket?.setPosition(this.x, this.y).setAngle(this.angle);
  }

  growthFunc = (ms: number) =>
    Math.floor(100 * Math.pow(Math.E, 0.00000000001 * ms));

  changeScene() {
    const data = {
      bombX: this.x,
      bombY: this.y,
    };
    this.scene.start("GameOver", data);
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  drawCrashout(crashout: number) {
    this.crashOut?.setText(`${crashout.toFixed(2)}x`);

    if (crashout >= 2.4) {
      this.y1?.setText((crashout + 0.2).toFixed(2) + "x");
      this.y2?.setText((((crashout + 0.2 - 1) / 4) * 3 + 1).toFixed(2) + "x");
      this.y3?.setText(((crashout + 0.2 - 1) / 2 + 1).toFixed(2) + "x");
      this.y4?.setText(((crashout + 0.2 - 1) / 4 + 1).toFixed(2) + "x");
    }
  }

  dropPlayer(player: string) {
    const randomX = Math.random() * 80 - 40;
    const randomY = Math.random() * 80 - 40;
    const playerName = this.add
      .text(this.x, this.y, player, {
        font: "bold 14px Manrope",
        color: "black",
        align: "center",
      })
      .setOrigin(0, 0.5)
      .setDepth(105);

    this.add.tween({
      targets: playerName,
      duration: 1800,
      x: this.x + randomX,
      y: this.y + randomY,
      alpha: 0.4,
      repeat: 0,
      yoyo: false,
    });

    setTimeout(() => {
      playerName.destroy();
    }, 1800);
  }
}
