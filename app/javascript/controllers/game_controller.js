import { Controller } from "@hotwired/stimulus";
import axios from "axios";


// const
// Connects to data-controller="game"
export default class extends Controller {
  static targets = [ "dice1", "dice2" ]
  static values = { x: Number, y: Number }

  connect() {
    console.log("début du jeu ");
    this.gridValues = ["X", "I", "V", "|||", "#", "Ø" ]
    this.grid = document.getElementById("grid");
    this.rows = this.grid.getElementsByTagName("tr");
    this.tiles = this.grid.getElementsByTagName("td");
    this.scoreCol = document.getElementById("score_col");
    this.scoreColTiles = this.scoreCol.getElementsByTagName("td");
    this.scoreRow = document.getElementById("score_row");
    this.scoreRowTiles = this.scoreRow.getElementsByTagName("td");
    this.SetFirstCell();
    this.newTurn();
    this.startGame();
  }


  newDices() {
    var dice1 = this.gridValues[Math.floor(Math.random()*6)]
    var dice2 = this.gridValues[Math.floor(Math.random()*6)]
    this.dice1Target.innerHTML = dice1;
    this.dice2Target.innerHTML = dice2;
    return [dice1, dice2];
  }

  startGame() {
    this.SetFirstCell();
    this.newTurn();
  };

  // set the top left tile with a random dice
  SetFirstCell() {
    this.tiles[0].innerHTML = this.gridValues[Math.floor(Math.random()*6)];
  }

  // clean all the tiles and put a data-action on all available tiles
  newTurn() {
    this.dices = this.newDices();
    for (let i = 0; i < this.tiles.length; i++) {
      this.cleanTile(this.tiles.item(i));
      if (this.tiles.item(i).innerHTML.length == 0 ) {
        var freeTiles = this.availableTiles(this.tiles.item(i))
        if (freeTiles.length > 0 ) {
            this.tiles.item(i).setAttribute("data-action", "click->game#setTile1");
            this.tiles.item(i).classList.add("active-tile");
        }
      }
    }
  }

  // set the first dice of a tile and add the data action on the surrounding tiles
  setTile1(event) {
    event.currentTarget.innerHTML = this.dices[0];
    for (let i = 0; i < this.tiles.length; i++) {
      this.cleanTile(this.tiles.item(i));
    }
    var freeTiles = this.availableTiles(event.currentTarget)
    freeTiles.forEach((tile) => {
      tile.setAttribute("data-action", "click->game#setTile2");
      tile.classList.add("active-tile");
    });
  }

  //set the second tile and choose if it's a next turn or the end of the game
  setTile2(event) {
    let freeCell = [];
    event.currentTarget.innerHTML = this.dices[1];
    for (let i = 0; i < this.tiles.length; i++) {
      // check all tiles
      if (this.tiles.item(i).innerHTML.length == 0 ) {
        var freeTiles = this.availableTiles(this.tiles.item(i))
        if (freeTiles.length > 0 ) {
          freeCell.push(this.tiles.item(i));
        }
      }
    }
    if (freeCell.length == 0 ) {
        this.cleanTile(event.currentTarget);
        this.endGame();
      } else {
        this.newTurn();
      }
  }

  //check if tiles are available around a tile
  availableTiles(tile) {
    // this.emptyTiles = [];
    let validTiles = [];
    var row = tile.parentElement;
    var rowIndex = row.rowIndex;
    var cellIndex = tile.cellIndex;
    // cell a droite

    if (cellIndex + 1 < row.cells.length) {
      var cell = this.tiles.item(rowIndex * 5 + cellIndex + 1);
      if (cell.innerHTML.length == 0) {
        validTiles.push(cell);
      }
    }
    //cell a gauche
    if (cellIndex -1 >= 0) {
      var cell = this.tiles.item(rowIndex * 5 + cellIndex - 1);
      if (cell.innerHTML.length == 0) {
        validTiles.push(cell);
      }
    }
    //cell en dessous
    if (rowIndex + 1 < row.parentElement.rows.length ) {
      var cell = this.tiles.item((rowIndex + 1) * 5 + cellIndex);
      if (cell.innerHTML.length == 0) {
        validTiles.push(cell);
      }
    }
    //cell au dessus
    if (rowIndex - 1 >= 0) {
      var cell = this.tiles.item((rowIndex - 1) * 5 + cellIndex);
      if (cell.innerHTML.length == 0) {
        validTiles.push(cell);
      }
    }
    return validTiles;
  }

  // clean the data-action of a tile
  cleanTile(tile) {
    tile.removeAttribute("data-action");
    tile.classList.remove("active-tile");
  }

  async endGame() {
    let gridScore = {};
    let cells = [];
    let y = 0
    // créer un array par ligne avec les inner html des td de chaque ligne
    for(let i = 0; i < this.tiles.length; i++ ) {
      if (i == 5 * (y + 1)) {
        gridScore[`row${y}`] = cells;
        cells = [];
        y++;
      }
      cells.push(this.tiles.item(i).innerHTML);
    }
    gridScore["row4"] = cells;
    const token = document.querySelector('[name=csrf-token]').content;
    console.log(token);
    console.log(gridScore);
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    const response = await axios.post('/game/end_game', gridScore);
    let scores = response.data["scores"];
    console.log(scores);
    console.log(response);
    this.scoreCol.classList.remove("d-none");
    this.scoreRow.classList.remove("d-none");
    this.scoreGrid(scores);
    console.log("grille fini, le résultat arrive ...");

  }

  scoreGrid(scores) {
    this.scoreColTiles.item(0).innerHTML = scores["diago"];
    this.scoreRowTiles.item(0).innerHTML = scores["diago"];
    this.scoreColTiles.item(6).innerHTML = scores["total"];
    for (let i = 1; i < 6; i++) {
      this.scoreColTiles.item(i).innerHTML = scores[`col${i - 1}`];
    }
    for (let i = 1; i < 6; i++) {
      this.scoreRowTiles.item(i).innerHTML = scores[`row${i - 1}`];
    }
  }

}
