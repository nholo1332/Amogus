import QuestionContent from './questionContent';

export default class Question {

  private _id: string;
  private _answer: number;
  private _question: QuestionContent;

  constructor() {
    this._id = '';
    this._answer = 0;
    this._question = new QuestionContent();
  }

  fromJSON(json: any): Question {
    const questionModel: Question = new Question();
    questionModel.id = json.id ?? '';
    questionModel.answer = json.answer ?? 0;
    questionModel.question = json.question ? new QuestionContent().fromJSON(json.question) : new QuestionContent();
    return questionModel;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get answer(): number {
    return this._answer;
  }

  set answer(value: number) {
    this._answer = value;
  }

  get question(): QuestionContent {
    return this._question;
  }

  set question(value: QuestionContent) {
    this._question = value;
  }

}
