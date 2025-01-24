import { SCALE_FACTOR } from "../utils/constants";

export function makePlayer(k) {
  let controlsEnabled = true;

  return k.add([
    k.sprite("kriby"),
    k.area({ shape: new k.Rect(k.vec2(0, 1.5), 8, 5) }), 
    k.anchor("center"),
    k.body({jumpForce: 600}), 
    k.scale(SCALE_FACTOR),
    k.pos(150, 350),
    {
        isDead: false,
        speed: 600,
        keyControllers: [],
        setControls() {
          const jumpLogic = () => {
            k.play("jump", { volume: 0.02 });
            this.jump();
          };
  
          this.keyControllers.push(k.onKeyPress("space", jumpLogic));
          this.keyControllers.push(k.onClick(jumpLogic));
        },
        disableControls() {
          this.keyControllers.forEach((keyController) =>
            keyController.cancel()
          );
      },
    },
  ]);
}
