export default class QuestionContent {

  private _title: string;
  private _answers: Map<number, string>;

  constructor() {
    this._title = '';
    this._answers = new Map<number, string>();
  }

  fromJSON(json: any): QuestionContent {
    const questionContent: QuestionContent = new QuestionContent();
    questionContent.title = json.title;
    Object.keys(json.answers).forEach((key) => {
      questionContent.answers.set(Number(key), json.answers[key]);
    });
    return questionContent;
  }

  toJSON(): object {
    return {
      title: this.title,
      answers: this.convertAnswersToJSON(),
    };
  }

  convertAnswersToJSON(): object {
    const data: any = [];
    for ( const [key, value] of this.answers.entries() ) {
      data[key] = value;
    }
    return data;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get answers(): Map<number, string> {
    return this._answers;
  }

  set answers(value: Map<number, string>) {
    this._answers = value;
  }

}
