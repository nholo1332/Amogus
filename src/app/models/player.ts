export default class Player {

  private _name: string;
  private _uid: string;
  private _avatar: string;

  constructor() {
    this._name = '';
    this._uid = '';
    this._avatar = '';
  }

  fromJSON(json: any): Player {
    const player: Player = new Player();
    player.name = json.name ?? '';
    player.uid = json.uid ?? '';
    player.avatar = json.avatar ?? '';
    return player;
  }

  toJSON(): object {
    return {
      name: this.name,
      uid: this.uid,
      avatar: this.avatar,
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

}
