import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { MainMenu } from "./scenes/MainMenu";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  // scale: {
  //   mode: Phaser.Scale.RESIZE,
  //   // autoCenter: Phaser.Scale.ZOOM_2X,
  // },
  width: 940,
  height: 451,
  parent: "game-container",
  backgroundColor: "#000",
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
