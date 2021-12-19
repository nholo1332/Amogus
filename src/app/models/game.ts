import Settings from './settings';
import Player from './player';
import State from './state';

export default class Game {

  private _owner: string;
  private _settings: Settings;
  private _players: Player[];
  private _questions: Map<number, string[]>;
  private _started: boolean;
  private _leaderboard: Map<string, number>;
  private _state: State;

  constructor() {
    this._owner = '';
    this._settings = new Settings();
    this._players = [];
    this._questions = new Map<number, string[]>();
    this._started = false;
    this._leaderboard = new Map<string, number>();
    this._state = new State();
  }

  fromJSON(json: any): Game {
    const game: Game = new Game();
    game.owner = json.owner ?? '';
    game.settings = json.settings ? new Settings().fromJSON(json.settings) : new Settings();
    for ( const player in json.players ) {
      game.players.push(new Player().fromJSON(json.players[player]));
    }
    Object.keys(json.questions ?? []).forEach((key) => {
      game.questions.set(Number(key), json.questions[key]);
    });
    game.started = json.started ?? false;
    Object.keys(json.leaderboard ?? []).forEach((key) => {
      game.leaderboard.set(key, json.leaderboard[key]);
    });
    game.state = json.state ? new State().fromJSON(json.state) : new State();
    return game;
  }

  toJSON(): object {
    return {
      owner: this.owner,
      settings: this.settings.toJSON(),
    };
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get settings(): Settings {
    return this._settings;
  }

  set settings(value: Settings) {
    this._settings = value;
  }

  get players(): Player[] {
    return this._players;
  }

  set players(value: Player[]) {
    this._players = value;
  }

  get questions(): Map<number, string[]> {
    return this._questions;
  }

  set questions(value: Map<number, string[]>) {
    this._questions = value;
  }

  get started(): boolean {
    return this._started;
  }

  set started(value: boolean) {
    this._started = value;
  }

  get leaderboard(): Map<string, number> {
    return this._leaderboard;
  }

  set leaderboard(value: Map<string, number>) {
    this._leaderboard = value;
  }

  get state(): State {
    return this._state;
  }

  set state(value: State) {
    this._state = value;
  }

}
