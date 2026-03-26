"use client";

// Each letter on a 5x7 grid
const FONT: Record<string, number[][]> = {
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  D: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  N: [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
  ],
  G: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  I: [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1],
  ],
  " ": [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
  ],
};

const CELL = 5;
const GAP = 1.5;
const STRIDE = CELL + GAP;
const LETTER_SPACING = 3; // extra gap between letters in grid units
const RADIUS = 1;
const COLOR = "#D97757";

export default function PixelLogo() {
  const text = "AD ENGINE";
  const chars = text.split("").map((ch) => FONT[ch] || FONT[" "]);

  // Build all rects
  const rects: { x: number; y: number }[] = [];
  let cursorX = 0;

  chars.forEach((grid, ci) => {
    const cols = grid[0].length;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          rects.push({
            x: (cursorX + c) * STRIDE,
            y: r * STRIDE,
          });
        }
      }
    }
    cursorX += cols + LETTER_SPACING;
    // Tighten space character
    if (text[ci] === " ") cursorX -= 1;
  });

  const totalW = cursorX * STRIDE;
  const totalH = 7 * STRIDE;

  return (
    <div className="bg-[#1a1a1a] rounded-xl px-5 py-3 inline-flex items-center">
      <svg
        viewBox={`-1 -1 ${totalW + 2} ${totalH + 2}`}
        className="h-7 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {rects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={CELL}
            height={CELL}
            rx={RADIUS}
            ry={RADIUS}
            fill={COLOR}
          />
        ))}
      </svg>
    </div>
  );
}
