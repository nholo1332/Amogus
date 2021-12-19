export default class Settings {

  private _discussionTime: number;
  private _peaceBouts: number;

  constructor() {
    this._discussionTime = 3;
    this._peaceBouts = 1;
  }

  fromJSON(json: any): Settings {
    const settings: Settings = new Settings();
    settings.discussionTime = json.discussionTime ?? 3;
    settings.peaceBouts = json.peaceBouts ?? 1;
    return settings;
  }

  toJSON(): object {
    return {
      discussionTime: this.discussionTime,
      peaceBouts: this.peaceBouts,
    }
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

}
