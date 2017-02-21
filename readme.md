alpha-js

> minimal chess engine interface

# WIP


## usage

see [example](./example.js)

```js
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


```

### output

```shell

$ node example.js


     fen: "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b - - 0 3"
    move:
             san: "e5"
            from: "e4"
              to: "e5"
           piece: "P"
          target: ""
  search:
          height: 6
           clock: 2934
           nodes: 464547
             nps: 158332
             npp:
                  0: 31
                  1: 407
                  2: 4409
                  3: 44496
                  4: 415203
   score: 30

 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
 ♟ ♟ _ _ ♟ ♟ ♟ ♟
 _ _ ♟ _ _ _ _ _
 _ _ _ ♟ ♙ _ _ _
 _ _ _ ♙ _ _ _ _
 _ _ _ _ _ _ _ _
 ♙ ♙ ♙ _ _ ♙ ♙ ♙
 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖




     fen: "rnbqkbnr/1p2pppp/p1p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR w - - 0 3"
    move:
             san: "a6"
            from: "a7"
              to: "a6"
           piece: "P"
          target: ""
  search:
          height: 6
           clock: 2106
           nodes: 382416
             nps: 181584
             npp:
                  0: 22
                  1: 257
                  2: 2813
                  3: 34779
                  4: 344544
   score: -20

 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
 _ ♟ _ _ ♟ ♟ ♟ ♟
 ♟ _ ♟ _ _ _ _ _
 _ _ _ ♟ ♙ _ _ _
 _ _ _ ♙ _ _ _ _
 _ _ _ _ _ _ _ _
 ♙ ♙ ♙ _ _ ♙ ♙ ♙
 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖




     fen: "rnbqkbnr/1p2pppp/p1p5/3pP3/3P4/3B4/PPP2PPP/RNBQK1NR b - - 0 3"
    move:
             san: "Bd3"
            from: "f1"
              to: "d3"
           piece: "B"
          target: ""
  search:
          height: 6
           clock: 1688
           nodes: 270158
             nps: 160046
             npp:
                  0: 31
                  1: 212
                  2: 3619
                  3: 22295
                  4: 244000
   score: 45

 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
 _ ♟ _ _ ♟ ♟ ♟ ♟
 ♟ _ ♟ _ _ _ _ _
 _ _ _ ♟ ♙ _ _ _
 _ _ _ ♙ _ _ _ _
 _ _ _ ♗ _ _ _ _
 ♙ ♙ ♙ _ _ ♙ ♙ ♙
 ♖ ♘ ♗ ♕ ♔ _ ♘ ♖




     fen: "rnbqkbnr/1p2pppp/p7/2ppP3/3P4/3B4/PPP2PPP/RNBQK1NR w - - 0 3"
    move:
             san: "c5"
            from: "c6"
              to: "c5"
           piece: "P"
          target: ""
  search:
          height: 6
           clock: 2498
           nodes: 483708
             nps: 193638
             npp:
                  0: 22
                  1: 352
                  2: 3394
                  3: 45119
                  4: 434820
   score: -70

 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
 _ ♟ _ _ ♟ ♟ ♟ ♟
 ♟ _ _ _ _ _ _ _
 _ _ ♟ ♟ ♙ _ _ _
 _ _ _ ♙ _ _ _ _
 _ _ _ ♗ _ _ _ _
 ♙ ♙ ♙ _ _ ♙ ♙ ♙
 ♖ ♘ ♗ ♕ ♔ _ ♘ ♖




     fen: "rnbqkbnr/1p2pppp/p7/2ppP3/3P4/2PB4/PP3PPP/RNBQK1NR b - - 0 3"
    move:
             san: "c3"
            from: "c2"
              to: "c3"
           piece: "P"
          target: ""
  search:
          height: 6
           clock: 1979
           nodes: 309097
             nps: 156188
             npp:
                  0: 35
                  1: 225
                  2: 3525
                  3: 22117
                  4: 283194
   score: 75

 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
 _ ♟ _ _ ♟ ♟ ♟ ♟
 ♟ _ _ _ _ _ _ _
 _ _ ♟ ♟ ♙ _ _ _
 _ _ _ ♙ _ _ _ _
 _ _ ♙ ♗ _ _ _ _
 ♙ ♙ _ _ _ ♙ ♙ ♙
 ♖ ♘ ♗ ♕ ♔ _ ♘ ♖




     fen: "rnb1kbnr/1p2pppp/p7/q1ppP3/3P4/2PB4/PP3PPP/RNBQK1NR w - - 0 3"
    move:
             san: "Qa5"
            from: "d8"
              to: "a5"
           piece: "Q"
          target: ""
  search:
          height: 6
           clock: 4292
           nodes: 854714
             nps: 199141
             npp:
                  0: 25
                  1: 356
                  2: 4058
                  3: 63491
                  4: 786783
   score: -90

 ♜ ♞ ♝ _ ♚ ♝ ♞ ♜
 _ ♟ _ _ ♟ ♟ ♟ ♟
 ♟ _ _ _ _ _ _ _
 ♛ _ ♟ ♟ ♙ _ _ _
 _ _ _ ♙ _ _ _ _
 _ _ ♙ ♗ _ _ _ _
 ♙ ♙ _ _ _ ♙ ♙ ♙
 ♖ ♘ ♗ ♕ ♔ _ ♘ ♖

```


## api

### ...

## License

MIT © [Scott M. Rogers](http://scottrogers.tech)
