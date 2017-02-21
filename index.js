'use strict';
const format = require('fmt-obj');

const {
	MAX_PLY, INFINITY, WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING,
	NULL, EMPTY, FORWARD, PAWN_RANK, PIECE_RANK, PROMOTION_RANK, STEPS, SLIDES,
	MATERIAL, PST, SQ, SQ64, SQ120, FEN_INITIAL, FEN_EMPTY, PIECES, COLORS,
	UNICODE, SQUARES, FEN
} = require('./constants.js');

var pieces;
var colors;
var kings;
var moves;
var nodes;
var turn;
var mx;
var mn;
var ply;
var move;
var clock;
var height;
var result;

function alphaBeta(alpha, beta, depth) {
  if(depth == 0) return evaluate();
  nodes[ply] += 1;
  generateMoves();
  for(var i = 0; i < moves[ply].length; i++) {
    var m = moves[ply][i];
    if(makeMove(m)) {
      var x = -alphaBeta(-beta, -alpha, depth - 1);
      unmakeMove(m);
      if(x > alpha) {
        if(x >= beta) return beta;
        alpha = x;
        if(ply == 0) move = Object.assign({}, m);
      }
    }
  }
  return alpha;
}

function generateMoves() {
  moves[ply] = [];
  var s, t;
  for(var f = 0; f < 64; f++) {
    if(colors[f] != mx) continue;
    if(pieces[f] == PAWN) {
      t = f + FORWARD[mx];
      if(colors[t + 1] == mn && SQ120[SQ64[t] + 1] != NULL) addMove(f, t + 1);
      if(colors[t + 1] == mn && SQ120[SQ64[t] + 1] != NULL) addMove(f, t + 1);
      if(colors[t] != EMPTY) continue;
      addMove(f, t);
      t += FORWARD[mx];
      if(colors[t] == EMPTY && f >> 3 == PAWN_RANK[mx]) addMove(f, t);
    } else {
      for(var i = 0; i < STEPS[pieces[f]].length; i++) {
        s = STEPS[pieces[f]][i];
        t = SQ120[SQ64[f] + s];
        while(t != NULL) {
          if(colors[t] != mx) addMove(f, t);
          if(!(colors[t] == EMPTY && SLIDES[pieces[f]])) break;
          t = SQ120[SQ64[t] + s];
        }
      }
    }
  }
}

function makeMove(m) {
  ply += 1;
  colors[m.to] = mx;
  pieces[m.to] = m.piece;
  colors[m.from] = EMPTY;
  pieces[m.from] = EMPTY;
  if(m.piece == PAWN && m.to >> 3 == PROMOTION_RANK[mx]) pieces[m.to] = QUEEN;
  if(m.piece == KING) kings[mx] = m.to;
  if(inCheck()) {
    mx ^= 1; mn ^= 1;
    return unmakeMove(m);
  }
  mx ^= 1; mn ^= 1;
  return true;
}

function unmakeMove(m) {
  ply -= 1;
  mx ^= 1; mn ^= 1;
  colors[m.from] = mx;
  pieces[m.from] = m.piece;
  colors[m.to] = m.target == EMPTY ? EMPTY : mn;
  pieces[m.to] = m.target;
  if(m.piece == KING) kings[mx] = m.from;
  return false;
}

function evaluate() {
  var x = 0;
  for(var i = 0; i < 64; i++) {
    if(colors[i] == mx) {
      x += (PST[i] + MATERIAL[pieces[i]]);
    } else if(colors[i] == mn) {
      x -= (PST[i] + MATERIAL[pieces[i]]);
    }
  }
  return x;
}

function inCheck() {
  var t, s, f = kings[mx];
  for(var i = 0; i < 8; i++) {
    t = SQ120[SQ64[f] + STEPS[KNIGHT][i]];
    if(t != NULL && pieces[t] == KNIGHT && colors[t] == mn) return true;
    s = STEPS[KING][i];
    t = SQ120[SQ64[f] + s];
    while(t != NULL && colors[t] == EMPTY) t = SQ120[SQ64[t] + s];
    if(t == NULL || colors[t] != mn) continue;
    switch(pieces[t]) {
      case QUEEN:
        return true;
      case BISHOP:
        if(i < 4) return true;
        break;
      case ROOK:
        if(i > 3) return true;
        break;
      case PAWN:
        if(Math.abs(s - FORWARD[mn]) == 1) return true;
        break;
      case KING:
        if(SQ120[SQ64[f] + s] == t) return true;
        break;
    }
  }
  return false;
}

function addMove(from, to) {
  moves[ply].push({
    from,
    to,
    piece: pieces[from],
    target: pieces[to]
  });
}

function parseFEN(fen) {
	var chunks = fen.split(' ');
  mx = chunks[1] == 'b' ? BLACK : WHITE;
  mn = mx ^ 1;
  turn = Math.max(+chunks[5] || 1, 1);
  chunks[0]
		.replace(/[\/1-8]/g, n => '_'.repeat(+n))
		.split('')
    .forEach((sq, i) => {
      pieces[i] = FEN[sq].piece;
      colors[i] = FEN[sq].color;
      if(pieces[i] == KING) kings[colors[i]] = i;
    });
}

function generateFEN() {
	var rows = [];
	for(var y = 0; y < 8; y++) {
		var e = 0, row = '';
		for(var x = 0; x < 8; x++) {
			var i = (y * 8) + x;
			if(colors[i] == EMPTY) {
				e += 1;
				if(x == 7) row += e;
			} else {
				if(e > 0) row += e;
				e = 0;
				row += PIECES[colors[i]][pieces[i]];
			}
		}
		rows.push(row);
	}
	return `${rows.join('/')} ${COLORS[mx]} - - 0 ${turn}`;
}

function serializeMove(m, c) {
	return {
		san: generateSAN(m, c),
		from: SQUARES[m.from],
		to: SQUARES[m.to],
		piece: PIECES[0][m.piece],
		target: m.target === EMPTY ? '' : PIECES[0][m.target]
	}
}

function serializeSearch() {
	var tn = nodes.reduce((x, i) => x + i);
	return {
		height: height,
		clock: clock,
		nodes: tn,
		nps: Math.round(1000 * tn / clock),
		npp: nodes.slice(1, height)
	}
}

function generateSAN(m, c) {
	var san = '';
	if(m.piece != PAWN) san += PIECES[0][m.piece];
	if(m.target != EMPTY) san += 'x';
	san += SQUARES[m.to];
	if(m.piece == PAWN && (m.to >> 3 == 7 || m.to >> 3 == 0)) san += '=Q';
	if(c) san += '+';
	return san;
}

function reset() {
	pieces = new Array(64).fill(EMPTY);
	colors = new Array(64).fill(EMPTY);
	kings = new Array(2).fill(NULL);
	moves = new Array(MAX_PLY).fill([]);
	nodes = new Array(MAX_PLY).fill(0);
	ply = 0;
	move = null;
	result = null;
}

module.exports = {
	setHeight: function(i) {
		height = parseInt(i) || 6;
	},
	run: function(fen) {
		reset();
		parseFEN(fen || FEN_INITIAL);
		var startTime = Date.now();
		alphaBeta(-INFINITY, INFINITY, height);
		if(!move) return null;
		clock = Date.now() - startTime;
		var e = evaluate();
		makeMove(move);
		var c = inCheck();
		result = {
			fen: generateFEN(),
			move: serializeMove(move, c),
			search: serializeSearch(),
			score: e - evaluate()
		}
		return result;
	},
	printResult: function() {
		console.log(format(result));
	},
	printBoard: function() {
		var board = [];
		for(var i = 0; i < 64; i++) {
			if(i % 8 === 0) board.push('\n');
			board.push(UNICODE[colors[i] % 6][pieces[i]]);
		}
		console.log(board.join(' '));
	}
}
