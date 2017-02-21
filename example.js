const alpha = require('./index.js');

let fen = 'rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3';
let result = {};

alpha.setHeight(6);

while(result !== null) {
	console.log('\n\n');
	result = alpha.run(fen);
	alpha.printResult();
	alpha.printBoard();
	fen = result.fen;
}
