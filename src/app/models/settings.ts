export default class Settings {

  private _discussionTime: number;
  private _peaceBouts: number;
  private _bouts: number;

  constructor() {
    this._discussionTime = 3;
    this._peaceBouts = 1;
    this._bouts = 5;
  }

  fromJSON(json: any): Settings {
    const settings: Settings = new Settings();
    settings.discussionTime = json.discussionTime ?? 3;
    settings.peaceBouts = json.peaceBouts ?? 1;
    settings.bouts = json.bouts ?? 5;
    return settings;
  }

  toJSON(): object {
    return {
      discussionTime: this.discussionTime,
      peaceBouts: this.peaceBouts,
      bouts: this.bouts,
    };
  }

  get discussionTime(): number {
    return this._discussionTime;
  }

  set discussionTime(value: number) {
    this._discussionTime = value;
  }

  get peaceBouts(): number {
    return this._peaceBouts;
  }

  set peaceBouts(value: number) {
    this._peaceBouts = value;
  }

  get bouts(): number {
    return this._bouts;
  }

  set bouts(value: number) {
    this._bouts = value;
  }

}
