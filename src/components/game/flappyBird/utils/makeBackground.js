export function makeBackground(k) {
  const existingBackground = k.get("background");
  if (existingBackground.length > 0) {
    return existingBackground[0]; 
  }

  const background = k.add([
    k.sprite("background"),
    k.pos(0, 0),
    k.area(),
    k.anchor("topleft"),
    k.scale(4), 
    "background",
  ]);

  k.loop(0.02, () => {
    background.pos.x -= 2;
    if (background.pos.x < -k.width()) {
      background.pos.x = 0;
    }
  });

  return background;
}
