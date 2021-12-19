export default class State {

  private _round: number;
  private _canAnswer: boolean;
  private _discussionTimeRemaining: number;
  private _canVote: boolean;

  constructor() {
    this._round = 0;
    this._canAnswer = false;
    this._discussionTimeRemaining = 180;
    this._canVote = false;
  }

  fromJSON(json: any): State {
    const state: State = new State();
    state.round = json.round ?? 0;
    state.canAnswer = json.canAnswer ?? false;
    state.discussionTimeRemaining = json.discussionTime ?? 180;
    state.canVote = json.canVote ?? false;
    return state;
  }

  toJSON(): object {
    return {
      round: this.round,
      canAnswer: this.canAnswer,
      discussionTimeRemaining: this.discussionTimeRemaining,
      canVote: this.canVote,
    }
  }

  get round(): number {
    return this._round;
  }

  set round(value: number) {
    this._round = value;
  }

  get canAnswer(): boolean {
    return this._canAnswer;
  }

  set canAnswer(value: boolean) {
    this._canAnswer = value;
  }

  get discussionTimeRemaining(): number {
    return this._discussionTimeRemaining;
  }

  set discussionTimeRemaining(value: number) {
    this._discussionTimeRemaining = value;
  }

  get canVote(): boolean {
    return this._canVote;
  }

  set canVote(value: boolean) {
    this._canVote = value;
  }

}
