export default class State {

  private _round: number;
  private _canAnswer: boolean;
  private _discussionTimeRemaining: number;
  private _canVote: boolean;
  private _currentBout: number;
  private _showAnswers: boolean;
  private _roundReward: number;
  private _correctAnswer: number;
  private _roundWinner: boolean;
  private _displayRankings: boolean;

  constructor() {
    this._round = 0;
    this._canAnswer = false;
    this._discussionTimeRemaining = 180;
    this._canVote = false;
    this._currentBout = 0;
    this._showAnswers = false;
    this._roundReward = 0;
    this._correctAnswer = -1;
    this._roundWinner = false;
    this._displayRankings = false;
  }

  fromJSON(json: any): State {
    const state: State = new State();
    state.round = json.round ?? 0;
    state.canAnswer = json.canAnswer ?? false;
    state.discussionTimeRemaining = json.discussionTimeRemaining ?? 180;
    state.canVote = json.canVote ?? false;
    state.currentBout = json.currentBout ?? 0;
    state.showAnswers = json.showAnswers ?? false;
    state.roundReward = json.roundReward ?? 0;
    state.correctAnswer = json.correctAnswer ?? -1;
    state.roundWinner = json.roundWinner ?? false;
    state.displayRankings = json.displayRankings ?? false;
    return state;
  }

  toJSON(): object {
    return {
      round: this.round,
      canAnswer: this.canAnswer,
      discussionTimeRemaining: this.discussionTimeRemaining,
      canVote: this.canVote,
      currentBout: this.currentBout,
      showAnswers: this.showAnswers,
      roundReward: this.roundReward,
      correctAnswer: this.correctAnswer,
      roundWinner: this.roundWinner,
      displayRankings: this.displayRankings,
    };
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

  get currentBout(): number {
    return this._currentBout;
  }

  set currentBout(value: number) {
    this._currentBout = value;
  }

  get showAnswers(): boolean {
    return this._showAnswers;
  }

  set showAnswers(value: boolean) {
    this._showAnswers = value;
  }

  get roundReward(): number {
    return this._roundReward;
  }

  set roundReward(value: number) {
    this._roundReward = value;
  }

  get correctAnswer(): number {
    return this._correctAnswer;
  }

  set correctAnswer(value: number) {
    this._correctAnswer = value;
  }

  get roundWinner(): boolean {
    return this._roundWinner;
  }

  set roundWinner(value: boolean) {
    this._roundWinner = value;
  }

  get displayRankings(): boolean {
    return this._displayRankings;
  }

  set displayRankings(value: boolean) {
    this._displayRankings = value;
  }

}
