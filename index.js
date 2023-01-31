let game;
function createPlayers(amountOfPlayers) {
    game.start(amountOfPlayers);
}
function init()
{
    game = new Game();
}

class Player
{
    constructor(index)
    {
        this.index = index;
        this.atTile = 0;
        this.pawn = document.getElementsByClassName("pawn" + index)[0];
        this.pawn.style.display = "block";
    }
}

class Tile
{
    constructor(div)
    {
        this.div = div;
        this.goto = -1;
    }
}

class Game 
{ 
    constructor() 
    {
        this.selectplayersDiv = document.getElementsByClassName("selectplayers")[0]; 
        this.winnerDiv = document.getElementsByClassName("winner")[0]; 
        this.playerturnDiv = document.getElementsByClassName("playerturn")[0]; 
        this.rollDiv = document.getElementsByClassName("roll")[0]; 
        this.mainDiv = document.getElementsByClassName("main")[0]; 
        this.boardDiv = document.getElementsByClassName("board")[0]; 
        this.boardoverlayDiv = document.getElementsByClassName("selectplayers")[0]; 

        console.log("test")
        
        this.tiles = []; 
        this.players = []; 
        this.playerturn = 0; 
        this.setupBoard();
    }
    setupBoard()
    {
        //1 = right, 0 = up , 3 = left
        let path = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
            0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 
            0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
            0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1]

        let x = 0;
        let y = 10;
        let tileSize = 55;
        
        for (var i = 0; i < path.length; i++)
        {
            let cmd = path[i];
            if (cmd == 1)
            {
                //right
                x++;
            }
            else if (cmd == 3)
            {
                //left
                x--;
            }
            else if (cmd == 0)
            {
                //up
                y--;
            }

            let div = this.makeBoardDiv(x * tileSize, y * tileSize, i + 1)
            
            let tile = new Tile(div);
            this.tiles.push(tile);
        }

        this.setupGotos();
    }
    setupGotos()
    {
        let goto = [[6, 14], [16, 4], [17, 23], [27, 33], [29, 10], [38, 43], [39, 20], [45, 34]];

        for (var i = 0; i < goto.length; i++)
        {
            let element = goto[i];

            let start = element[0] - 1;
            let end = element[1] - 1;

            let tile = this.tiles[start];
            tile.goto = end;
        }
    }

    start(amountOfPlayers)
    {   
        this.selectplayersDiv.style.display = "none";
        this.winnerDiv.style.display = "none";
        for (let i = 0; i < 4; i++) {
            document.getElementsByClassName("pawn" + i)[0].style.display = "none";
        }
        for (let i = 0; i < amountOfPlayers; i++) {
            this.players.push(new Player(i));
        }
        this.playerTurn = -1;
        this.moveToNextPlayer();
    }

    moveToNextPlayer() {
        this.playerTurn++;
        if (this.playerTurn >= this.players.length)
        {
            this.playerTurn = 0;
        }
        let player = this.players[this.playerTurn];
        let roll = Math.floor(Math.random() * 6) + 1;
        let newTile = player.atTile + roll;
        if (newTile > 50) {
            newTile = newTile - 50 - (newTile - player.atTile);
        }
        // rest of the moveToNextPlayer function logic
    }

    draw()
    {
        for (let i = 0; i < this.players.length; i++) {
            this.setPawn(i, this.players[i].atTile);
        }
    }

    setPawn(playerI, atTile) {
        let player = this.players[playerI];
        player.atTile = atTile;
        let tile = this.tiles[atTile];
        player.pawn.style.left = tile.div.style.left;
        player.pawn.style.top = tile.div.style.top;
    }

    roll() 
    {
        let roll = Math.floor(Math.random() * 6) + 1;
        console.log(roll)
        this.rollDiv.style.backgroundImage = "url(img/dice" + roll + ".png)";
        let player = this.players[this.playerTurn];
        let atTile = player.atTile;
        console.log(player);
        atTile = (atTile + roll) % this.tiles.length;
        if (atTile >= this.tiles.length-1) {
            this.winnerDiv.textContent = "Player " + (this.playerTurn + 1) + " wins!";
            this.winnerDiv.style.display = "block";
        } 
        else {
            let tile = this.tiles[atTile];
            if (tile.goto !== -1) {
                atTile = tile.goto;
            }
            this.setPawn(this.playerTurn, atTile);
            this.draw();
            this.moveToNextPlayer();
        }
    }
    makeBoardDiv(x,y,tileDisplayNumber)
    {
        let div = document.createElement("div");

        div.className = "tile";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.textContent = tileDisplayNumber;    
          
        this.boardDiv.appendChild(div);

        return div;
    }
    
    backButton(){
        let backButton = document.createElement("button");
        backButton.innerHTML = "Move Back 1 Tile";
        backButton.addEventListener("click", function(){
           let currentPlayer = game.players[game.playerTurn];
           currentPlayer.atTile--;
           currentPlayer.pawn.style.left = game.tiles[currentPlayer.atTile].div.style.left;
           currentPlayer.pawn.style.top = game.tiles[currentPlayer.atTile].div.style.top;
        });
        document.body.appendChild(backButton);
    }
}