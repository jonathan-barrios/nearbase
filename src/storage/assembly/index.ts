import {context, u128, PersistentMap, logging, RNG, Context} from "near-sdk-as"

enum GameState{ Created, InProgress, Complted, NotFound }

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