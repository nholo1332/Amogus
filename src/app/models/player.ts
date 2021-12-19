export default class Player {

  private _name: string;
  private _uid: string;

  constructor() {
    this._name = '';
    this._uid = '';
  }

  fromJSON(json: any): Player {
    const player: Player = new Player();
    player.name = json.name ?? '';
    player.uid = json.uid ?? '';
    return player;
  }

  toJSON(): object {
    return {
      name: this.name,
      uid: this.uid,
    }
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

}
