'use strict';

const MAX_PLY = 10;
const INFINITY = 10000000;
const WHITE = 0;
const BLACK = 1;
const PAWN = 0;
const KNIGHT = 1;
const BISHOP = 2;
const ROOK = 3;
const QUEEN = 4;
const KING = 5;
const NULL = -1;
const EMPTY = 6;
const FORWARD = [-8, 8];
const PAWN_RANK = [7, 0];
const PIECE_RANK = [6, 1];
const PROMOTION_RANK = [0, 7];
const STEPS = [
	[],
	[-21, -19, -12, -8, 8, 12, 19, 21],
	[11, -11, -9, 9],
	[1, 10, -1, -10],
	[-9, 9, -11, 11, -10, 10, -1, 1],
	[-9, 9, -11, 11, -10, 10, -1, 1]
];
const SLIDES = [false, false, true, true, true, false];
const MATERIAL = [100, 320, 330, 540, 960, 3200];
const PST = [
	-40,-30,-20,-10,-10,-20,-30,-40,
	-30,-15, -5,  0,  0, -5,-15,-30,
	-20, -5, 10, 15, 15, 10, -5,-20,
	-10,  5, 20, 30, 30, 20,  5,-10,
	-10,  5, 20, 30, 30, 20,  5,-10,
	-20, -5, 10, 15, 15, 10, -5,-20,
	-30,-15, -5,  0,  0, -5,-15,-30,
	-40,-30,-20,-10,-10,-20,-30,-40
];
const SQ = [
	 0,  1,  2,  3,  4,  5,  6,  7,
	 8,  9, 10, 11, 12, 13, 14, 15,
	16, 17, 18, 19, 20, 21, 22, 23,
	24, 25, 26, 27, 28, 29, 30, 31,
	32, 33, 34, 35, 36, 37, 38, 39,
	40, 41, 42, 43, 44, 45, 46, 47,
	48, 49, 50, 51, 52, 53, 54, 55,
	56, 57, 58, 59, 60, 61, 62, 63
];
const SQ64 = [
	21, 22, 23, 24, 25, 26, 27, 28,
	31, 32, 33, 34, 35, 36, 37, 38,
	41, 42, 43, 44, 45, 46, 47, 48,
	51, 52, 53, 54, 55, 56, 57, 58,
	61, 62, 63, 64, 65, 66, 67, 68,
	71, 72, 73, 74, 75, 76, 77, 78,
	81, 82, 83, 84, 85, 86, 87, 88,
	91, 92, 93, 94, 95, 96, 97, 98
];
const SQ120 = [
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
	-1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
	-1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
	-1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
	-1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
	-1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
	-1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
	-1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];
const FEN_INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FEN_EMPTY = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
const PIECES = [
	['P','N','B','R','Q','K','_'],
	['p','n','b','r','q','k','_']
];
const COLORS = ['w', 'b'];
const UNICODE = [
	['♙', '♘', '♗', '♖', '♕', '♔', '_'],
	['♟', '♞', '♝', '♜', '♛', '♚', '_']
];
const SQUARES = [
	'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
	'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
	'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
	'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
	'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
	'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
	'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
	'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
];
const FEN = {
	P: { color: 0, piece: 0 },
	N: { color: 0, piece: 1 },
	B: { color: 0, piece: 2 },
	R: { color: 0, piece: 3 },
	Q: { color: 0, piece: 4 },
	K: { color: 0, piece: 5 },
	p: { color: 1, piece: 0 },
	n: { color: 1, piece: 1 },
	b: { color: 1, piece: 2 },
	r: { color: 1, piece: 3 },
	q: { color: 1, piece: 4 },
	k: { color: 1, piece: 5 },
	_: { color: 6, piece: 6 }
};

const TEST_POSITIONS = [
	'rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7',
	'rn1qkb1r/1p3ppp/p2pbn2/4p3/4P3/1NN1BP2/PPP3PP/R2QKB1R b KQkq - 0 8',
	'rnbqkb1r/1p3ppp/p2ppn2/8/3NP3/2N5/PPP1BPPP/R1BQK2R w KQkq - 0 7',
	'r1bqk2r/1p2bpp1/p1nppn1p/8/3NP3/2N1B3/PPPQ1PPP/2KR1B1R w kq - 0 10',
	'r1bqkb1r/5ppp/p1np1n2/1p2p1B1/4P3/N1N5/PPP2PPP/R2QKB1R w KQkq b6 0 9',
	'r1b1kbnr/ppqp1ppp/2n1p3/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
	'rnbqkbnr/1p1p1ppp/p3p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5',
	'rnbqkbnr/pp1ppppp/8/2p5/4P3/2P5/PP1P1PPP/RNBQKBNR b KQkq - 0 2',
	'rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 0 2',
	'r1bq1rk1/4bppp/p2p1n2/npp1p3/3PP3/2P2N1P/PPB2PP1/RNBQR1K1 b - d3 0 11',
	'rnbqkb1r/ppp2ppp/8/3p4/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 0 6',
	'rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq - 0 6',
	'rnbqkbnr/pp3ppp/4p3/2pp4/3PP3/8/PPPN1PPP/R1BQKBNR w KQkq c6 0 4',
	'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3',
	'rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 4',
	'r1bqkb1r/p2n1ppp/2p1pn2/1p6/3P4/2NBPN2/PP3PPP/R1BQK2R b KQkq - 0 8',
	'r1bqk2r/pp1n1ppp/2pbpn2/3p4/2PP4/2N1PN2/PPQ2PPP/R1B1KB1R w KQkq - 0 7',
	'rnbqkb1r/pp3ppp/2p1pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 0 5',
	'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5NP1/PP2PP1P/RNBQKB1R b KQkq - 0 4',
	'rn1qk2r/p3bppp/bpp1pn2/3p4/2PP4/1PB2NP1/P3PPBP/RN1QK2R w KQkq d6 0 9',
	'rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/P4N2/1P2PPPP/RNBQKB1R b KQkq - 0 4',
	'rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2NBP3/PP3PPP/R1BQK1NR b KQ - 0 5',
	'rnbq1rk1/p1pp1ppp/1p2pn2/8/2PP4/P1Q5/1P2PPPP/R1B1KBNR w KQ - 0 7',
	'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 9',
	'rnbqk2r/ppp1ppbp/5np1/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq d6 0 5',
	'rnbqk2r/ppp1ppbp/6p1/8/3PP3/2P5/P4PPP/R1BQKBNR w KQkq - 0 7',
	'rnbq1rk1/ppp1ppbp/3p1np1/8/2PP4/5NP1/PP2PPBP/RNBQK2R w KQ - 0 6',
	'rn1qkb1r/pp2pppp/2p2n2/5b2/P1pP4/2N2N2/1P2PPPP/R1BQKB1R w KQkq - 0 6',
	'rnbqkb1r/ppp1pppp/5n2/8/2pP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4',
	'r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4',
	'rnbqkb1r/pp1ppppp/5n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R b KQkq - 0 3',
	'rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2',
];


module.exports = {
	MAX_PLY,
  INFINITY,
  WHITE,
  BLACK,
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
	NULL,
  EMPTY,
  FORWARD,
  PAWN_RANK,
  PIECE_RANK,
  PROMOTION_RANK,
  STEPS,
  SLIDES,
	MATERIAL,
  PST,
  SQ,
  SQ64,
  SQ120,
  FEN_INITIAL,
  FEN_EMPTY,
  PIECES,
  COLORS,
	UNICODE,
  SQUARES,
  FEN,
	TEST_POSITIONS
}
