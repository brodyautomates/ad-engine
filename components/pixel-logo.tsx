"use client";

// Each letter defined on a grid where each "1" is a brick.
// Letters use thick 2-unit strokes on a larger grid to match
// the Claude Code block style. Grid is roughly 10w x 14h per letter.
const FONT: Record<string, number[][]> = {
  A: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,0,0,1,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
  ],
  D: [
    [1,1,1,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,0,0],
    [1,1,0,0,0,0,1,1,1,0],
    [1,1,0,0,0,0,0,1,1,0],
    [1,1,0,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,1,1,0],
    [1,1,0,0,0,0,1,1,1,0],
    [1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,0,0,0],
  ],
  E: [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
  N: [
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,0,1,1],
    [1,1,1,1,0,0,0,0,1,1],
    [1,1,1,1,0,0,0,0,1,1],
    [1,1,0,1,1,0,0,0,1,1],
    [1,1,0,1,1,1,0,0,1,1],
    [1,1,0,0,1,1,0,0,1,1],
    [1,1,0,0,1,1,1,0,1,1],
    [1,1,0,0,0,1,1,0,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
  ],
  G: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
  ],
  I: [
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
  ],
  " ": [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
};

// Block dimensions — wider than tall to match the brick look
const BW = 7;   // block width
const BH = 5;   // block height
const GAP = 1.2; // gap between blocks
const SW = BW + GAP; // stride width
const SH = BH + GAP; // stride height
const LETTER_GAP = 3; // columns of gap between letters
const R = 1.2; // corner radius

// Color palette — slight variation for texture
const COLORS = [
  "#D97757", "#D4714F", "#CF6B48", "#DE7D5D",
  "#D07050", "#D97757", "#CC6844", "#D5745A",
];

// Thin outline color
const STROKE = "#E8956A";

function seededRandom(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export default function PixelLogo() {
  const text = "AD ENGINE";
  const chars = text.split("").map((ch) => FONT[ch] || FONT[" "]);

  const rects: { x: number; y: number; color: string }[] = [];
  let cursorX = 0;

  chars.forEach((grid) => {
    const cols = grid[0].length;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          const color = COLORS[Math.floor(seededRandom(cursorX + c, r) * COLORS.length)];
          rects.push({
            x: (cursorX + c) * SW,
            y: r * SH,
            color,
          });
        }
      }
    }
    cursorX += cols + LETTER_GAP;
  });

  const totalW = (cursorX - LETTER_GAP) * SW;
  const totalH = 13 * SH;

  return (
    <div className="bg-[#2b2b2b] rounded-2xl px-6 py-4 inline-flex items-center shadow-elevated">
      <svg
        viewBox={`-2 -2 ${totalW + 4} ${totalH + 4}`}
        className="h-9 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {rects.map((rect, i) => (
          <g key={i}>
            {/* Block fill */}
            <rect
              x={rect.x}
              y={rect.y}
              width={BW}
              height={BH}
              rx={R}
              ry={R}
              fill={rect.color}
            />
            {/* Thin outline */}
            <rect
              x={rect.x + 0.4}
              y={rect.y + 0.4}
              width={BW - 0.8}
              height={BH - 0.8}
              rx={R - 0.2}
              ry={R - 0.2}
              fill="none"
              stroke={STROKE}
              strokeWidth={0.4}
              opacity={0.5}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
