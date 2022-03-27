import {context, u128, PersistentMap, logging, RNG, Context} from "near-sdk-as"

enum GameState{ Created, InProgress, Completed, NotFound }

@nearBindgen

export class Game {
    id: u32;
    gameState: GameState;
    deposit1: u128;
    player1: string;
    player1Guess: u32;
    compGuess: u32;
    winner: string;
    loser: string;

    constructor(){
        const idValue = new RNG<u32>(1, u32.MAX_VALUE)
        this.id = idValue.next()
        this.gameState = GameState.Created
        this.deposit1 = context.attachedDeposit
        this.player1 = context.sender
    }
}


const games = new PersistentMap<u32, Game>("k")

export function createGame(): u32 {
    let game = new Game();
    games.set(game.id, game)
    // logging.log("Game ID is " + game.id.toString())
    return game.id
}

export function playGame(gameId: u32, guess: u32): string {
    const game = games.getSome(gameId)
    if (game != null){
        if (game.gameState == GameState.Created){
            game.gameState - GameState.InProgress
            if (context.sender == game.player1){
                game.player1Guess = guess
                let rng = new RNG<u32>(1, 10)
                const selectedNum = rng.next()
                game.compGuess = selectedNum;

                if (guess == selectedNum){
                    game.gameState = GameState.Completed
                    game.winner = context.sender
                    games.set(gameId, game)
                    logging.log("You win!")
                    return "won"
                    
                } else {
                    game.gameState = GameState.Completed
                    game.loser = context.sender
                    games.set(gameId, game)
                    logging.log("You lost! The computer's number was " + selectedNum.toString())
                    return "lost"
                }
            } return "wrong player"
        } return "game in progress or over"
    }
    return "game not found"
}