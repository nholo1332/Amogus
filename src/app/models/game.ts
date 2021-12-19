import Settings from './settings';
import Player from './player';

export default class Game {

  private _owner: string;
  private _settings: Settings;
  private _players: Player[];

  constructor() {
    this._owner = '';
    this._settings = new Settings();
    this._players = [];
  }

  fromJSON(json: any): Game {
    const game: Game = new Game();
    game.owner = json.owner ?? '';
    game.settings = json.settings ? new Settings().fromJSON(json.settings) : new Settings();
    for ( const player in json.players ) {
      game.players.push(new Player().fromJSON(json.players[player]));
    }
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

}
