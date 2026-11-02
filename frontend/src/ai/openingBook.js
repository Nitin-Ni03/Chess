// Comprehensive Chess Opening Book with ECO codes, names, and pedagogical explanations
export const OPENING_BOOK = [
  // Open Games (1. e4 e5)
  {
    moves: ['e4'],
    eco: 'B00',
    name: "King's Pawn Opening",
    desc: 'White stakes an immediate claim in the center and frees diagonal pathways for both the Queen and light-squared Bishop.',
  },
  {
    moves: ['e4', 'e5'],
    eco: 'C20',
    name: 'Open Game',
    desc: "Black responds symmetrically, seizing equal control of the central d4 and f4 squares while freeing their own pieces.",
  },
  {
    moves: ['e4', 'e5', 'Nf3'],
    eco: 'C40',
    name: "King's Knight Opening",
    desc: "White develops a knight toward the center, putting immediate attacking pressure on Black's undefended e5 pawn.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6'],
    eco: 'C44',
    name: "King's Knight Opening: Normal Defense",
    desc: "Black develops naturally while solidly protecting the e5 pawn with the knight.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    eco: 'C50',
    name: 'Italian Game',
    desc: "A classical opening aiming directly at Black's vulnerable f7 square, the weakest point in Black's camp before castling.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
    eco: 'C50',
    name: 'Giuoco Piano',
    desc: "The 'Quiet Game'. Both sides develop their bishops symmetrically, contesting the central diagonals.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'],
    eco: 'C55',
    name: 'Two Knights Defense',
    desc: "Black counterattacks White's e4 pawn instead of passively defending, leading to sharp, tactical play.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    eco: 'C60',
    name: 'Ruy Lopez (Spanish Opening)',
    desc: "One of the oldest and most respected openings in chess history. White attacks the knight defending Black's central e5 pawn.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'],
    eco: 'C68',
    name: 'Ruy Lopez: Morphy Defense',
    desc: "Black immediately challenges the bishop, asking White to declare their intentions on the light squares.",
  },
  {
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
    eco: 'C45',
    name: 'Scotch Game',
    desc: "White opens the center immediately with an aggressive pawn break, aiming for rapid piece activity.",
  },
  {
    moves: ['e4', 'e5', 'f4'],
    eco: 'C30',
    name: "King's Gambit",
    desc: "A romantic and daring sacrifice of the f-pawn to deflect Black's center pawn and open the f-file for attack.",
  },

  // Semi-Open Games (1. e4 ...)
  {
    moves: ['e4', 'c5'],
    eco: 'B20',
    name: 'Sicilian Defense',
    desc: "The most popular counter to 1.e4. Black creates an asymmetrical pawn structure, fighting for the central d4 square with the c-pawn.",
  },
  {
    moves: ['e4', 'c5', 'Nf3'],
    eco: 'B27',
    name: 'Sicilian Defense: Open Variation Prep',
    desc: "White prepares to open the center with an early d4 strike, accelerating development.",
  },
  {
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    eco: 'B90',
    name: 'Sicilian Defense: Najdorf Variation',
    desc: "The favorite weapon of Kasparov and Fischer. Sharp, double-edged, and tactically rich.",
  },
  {
    moves: ['e4', 'c5', 'Nf3', 'Nc6'],
    eco: 'B30',
    name: 'Sicilian Defense: Old Sicilian',
    desc: "Black brings out the knight to contest central squares and prepare kingside or queenside operations.",
  },
  {
    moves: ['e4', 'e6'],
    eco: 'C00',
    name: 'French Defense',
    desc: "A solid and resilient defense. Black prepares to counter in the center with ...d5, supported by the e6 pawn.",
  },
  {
    moves: ['e4', 'e6', 'd4', 'd5'],
    eco: 'C00',
    name: 'French Defense: Main Line',
    desc: "The classic French pawn clash. White usually advances or defends e4, defining pawn chains.",
  },
  {
    moves: ['e4', 'c6'],
    eco: 'B10',
    name: 'Caro-Kann Defense',
    desc: "An ultra-solid response. Black supports an upcoming ...d5 push without trapping their light-squared bishop inside the pawn chain.",
  },
  {
    moves: ['e4', 'd6'],
    eco: 'B07',
    name: 'Pirc Defense',
    desc: "A hypermodern setup where Black allows White a broad pawn center and plans to strike back at it later.",
  },
  {
    moves: ['e4', 'd5'],
    eco: 'B01',
    name: 'Scandinavian Defense',
    desc: "Black challenges White's e4 pawn on move 1, forcing an immediate resolution in the center.",
  },

  // Closed Games (1. d4 d5)
  {
    moves: ['d4'],
    eco: 'D00',
    name: "Queen's Pawn Opening",
    desc: "White controls the center with a solidly defended pawn, favoring strategic maneuvering over immediate tactics.",
  },
  {
    moves: ['d4', 'd5'],
    eco: 'D00',
    name: 'Closed Game',
    desc: "Black matches White's stake in the center, leading to deep strategic and positional battles.",
  },
  {
    moves: ['d4', 'd5', 'c4'],
    eco: 'D06',
    name: "Queen's Gambit",
    desc: "White offers a temporary wing pawn to deflect Black's center pawn and seize total control of d4 and e4.",
  },
  {
    moves: ['d4', 'd5', 'c4', 'e6'],
    eco: 'D30',
    name: "Queen's Gambit Declined",
    desc: "Black firmly protects the d5 center outpost with the e-pawn, creating a fortress in the center.",
  },
  {
    moves: ['d4', 'd5', 'c4', 'c6'],
    eco: 'D10',
    name: 'Slav Defense',
    desc: "One of Black's most reliable defenses to 1.d4, supporting d5 without locking in the c8 bishop.",
  },
  {
    moves: ['d4', 'd5', 'c4', 'dxc4'],
    eco: 'D20',
    name: "Queen's Gambit Accepted",
    desc: "Black takes the offered pawn, aiming to temporarily slow White down before establishing counterplay.",
  },
  {
    moves: ['d4', 'd5', 'Bf4'],
    eco: 'D00',
    name: 'London System',
    desc: "A popular, universal, and harmonious setup. White develops the dark-squared bishop outside the pawn chain before playing e3.",
  },
  {
    moves: ['d4', 'Nf6'],
    eco: 'A45',
    name: 'Indian Defense',
    desc: "Black prevents White from playing an uncontested e4 and maintains flexibility in piece deployment.",
  },
  {
    moves: ['d4', 'Nf6', 'c4', 'g6'],
    eco: 'E60',
    name: "King's Indian / Grünfeld Setup",
    desc: "Black plans to fianchetto the bishop to g7, putting long-range pressure across the dark diagonal.",
  },
  {
    moves: ['d4', 'Nf6', 'c4', 'e6'],
    eco: 'E00',
    name: 'Nimzo / Bogo / Queen’s Indian Setup',
    desc: "Flexible hypermodern approach keeping options open for ...Bb4 or ...d5.",
  },

  // Flank Openings (1. c4, 1. Nf3, etc.)
  {
    moves: ['c4'],
    eco: 'A10',
    name: 'English Opening',
    desc: "A flank opening controlling the d5 square from the side, frequently transposing into rich pawn structures.",
  },
  {
    moves: ['Nf3'],
    eco: 'A04',
    name: 'Réti Opening',
    desc: "A flexible master setup preventing ...e5 while holding all central options open.",
  },
];

// Helper to look up opening by sequence of SAN moves
export function lookupOpening(moveHistory = []) {
  if (!moveHistory || moveHistory.length === 0) return null;

  const sans = moveHistory.map(m => typeof m === 'string' ? m : m.san);

  // Find longest matching opening
  let bestMatch = null;
  let maxMatchedLength = 0;

  for (const opening of OPENING_BOOK) {
    if (opening.moves.length <= sans.length) {
      const matches = opening.moves.every((move, idx) => move === sans[idx]);
      if (matches && opening.moves.length > maxMatchedLength) {
        bestMatch = opening;
        maxMatchedLength = opening.moves.length;
      }
    }
  }

  // Also check if current move is still within recognized opening book
  const isBookMove = bestMatch !== null && sans.length <= bestMatch.moves.length;

  return {
    opening: bestMatch,
    isBookMove,
  };
}
