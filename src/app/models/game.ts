import Settings from './settings';

export default class Game {

  private _owner: string;
  private _settings: Settings;

  constructor() {
    this._owner = '';
    this._settings = new Settings();
  }

  fromJSON(json: any): Game {
    const game: Game = new Game();
    game.owner = json.owner ?? '';
    game.settings = json.settings ? new Settings().fromJSON(json.settings) : new Settings();
    return game;
  }

  toJSON(): object {
    return {
      owner: this.owner,
      settings: this.settings.toJSON(),
    }
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

}
