const alpha = require('./index.js');

const { TEST_POSITIONS } = require('./constants.js');

TEST_POSITIONS.forEach((fen, i) => {
	console.log('\n\n');
	alpha.setHeight(6);
	alpha.run(fen);
	alpha.printResult();
	alpha.printBoard();
});
