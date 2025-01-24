export function makeScoreBox(k, position, score) {

  const box = k.add([
    k.rect(200, 100, { radius: 10 }),
    k.color(k.Color.fromHex("#000000")),
    k.pos(position.x - 100, position.y - 50), 
    k.area(),
    k.anchor("center"),
    k.opacity(0.8), 
    k.layer("ui"),
  ]);

  const text = k.add([
    k.text(`Score: ${score}`, { size: 32, align: "center" }),
    k.pos(position.x - 100, position.y - 50),
    k.anchor("center"),
    k.layer("ui"),
  ]);

  return {box, text};
}
