import { Controller } from "@hotwired/stimulus";

const gridValues = ["X", "I", "V", "|||", "#", "Ø" ]
const turns = 12;
const grid = document.getElementById("grid");
const tiles = grid.getElementsByTagName("td");
// const
// Connects to data-controller="game"
export default class extends Controller {
  static targets = [ "dice1", "dice2" ]
  static values = { x: Number, y: Number }

  connect() {
    console.log("hello from the game controller");
    this.SetFirstCell();
    console.log(tiles.item(0));
    console.log(typeof tiles)
    this.startGame();
  }

  SetFirstCell() {
    // genere la case en haut à gauche au début de la game random par rapport aux 6 valeurs
    tiles[0].innerHTML = gridValues[Math.floor(Math.random()*6)];
  }

  newDices() {
    var dice1 = gridValues[Math.floor(Math.random()*6)]
    var dice2 = gridValues[Math.floor(Math.random()*6)]
    this.dice1Target.innerHTML = dice1;
    this.dice2Target.innerHTML = dice2;
  }

  startGame() {
    while (turns > 0) {
      // genere les deux des ce qui correspond le tirage
        this.newDices();
      // premier dé:
        // propose toutes les cases possibles (pas déja attribuées)
        for (var i = 0; i < tiles.length; i++) {
          if (tiles.item(i).innerHTML.length > 0 ) {
            tiles.item(i).setAttribute("data-action", "click->game#setTile1");
            tiles.item(i).classList.add("active-tile")
          }
        };
        // au clique sur une case attribue la valeur du premier dé si dispo
        this.setTile1();

        }
      // deuxième dé:
        // propose les cases possibles (x += 1, x-=1, y+=1 ou y-=1) mais pas case unique
        // au clique attribue la case si disponible
      turns -= 1;
  }

  setTile1(tile) {
    tile.innerHTML = dice1;
    for (var i = 0; i < tiles.length; i++) {
      if (tiles.item(i).innerHTML.length > 0 ) {
        tiles.item(i).setAttribute("data-action", "click->game#setTile1");
        tiles.item(i).classList.add("active-tile")
      }
    };
  }

}




// definir une game: grille, valeurs possible, joué?, les deux tirages, numéro du tour ?


// pendant la game:
