import { SCALE_FACTOR } from "../utils/constants";

export function makePlayer(k) {
  let controlsEnabled = true;

  return k.add([
    k.sprite("kriby"),
    k.pos(150, 350),
    k.body(), 
    k.area({ shape: new k.Rect(k.vec2(0, 1.5), 8, 5) }), 
    k.anchor("center"),
    k.scale(SCALE_FACTOR),
    {
        isDead: false,
        speed: 600,
        inputControllers: [],
        setControls() {
          const jumpLogic = () => {
            k.play("jump", { volume: 0.02 });
            this.jump();
          };
  
          this.inputControllers.push(k.onKeyPress("space", jumpLogic));
          this.inputControllers.push(k.onClick(jumpLogic));
          this.inputControllers.push(k.onGamepadButtonPress("south", jumpLogic));
        },
        disableControls() {
          this.inputControllers.forEach((inputController) =>
            inputController.cancel()
          );
      },
    },
  ]);
}
