export default class Player {

  private _name: string;
  private _uid: string;
  private _avatar: string;
  private _inGame: boolean;
  private _imposter: boolean;

  constructor() {
    this._name = '';
    this._uid = '';
    this._avatar = '';
    this._inGame = true;
    this._imposter = false;
  }

  fromJSON(json: any): Player {
    const player: Player = new Player();
    player.name = json.name ?? '';
    player.uid = json.uid ?? '';
    player.avatar = json.avatar ?? '';
    player.inGame = json.inGame ?? true;
    player.imposter = json.imposter ?? false;
    return player;
  }

  toJSON(): object {
    return {
      name: this.name,
      uid: this.uid,
      avatar: this.avatar,
      inGame: this.inGame,
      imposter: this.imposter,
    };
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get uid(): string {
    return this._uid;
  }

  set uid(value: string) {
    this._uid = value;
  }

  get avatar(): string {
    return this._avatar;
  }

  set avatar(value: string) {
    this._avatar = value;
  }

  get inGame(): boolean {
    return this._inGame;
  }

  set inGame(value: boolean) {
    this._inGame = value;
  }

  get imposter(): boolean {
    return this._imposter;
  }

  set imposter(value: boolean) {
    this._imposter = value;
  }

}
