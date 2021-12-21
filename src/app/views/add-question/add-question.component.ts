import {Component, OnInit} from '@angular/core';
import Question from '../../models/question';
import {DatabaseProvider} from '../../providers/databaseProvider';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent implements OnInit {

  questionData = '';

  constructor(private db: DatabaseProvider) {
  }

  ngOnInit(): void {
  }

  importQuestion() {
    let questionsList: Question[] = [];
    const questionSections = this.questionData.replace(/&nbsp;/g, '').split('<br>');
    questionSections.forEach((questions) => {
      const newQuestion: Question = new Question();
      const questionText = questions.substring(
        questions.indexOf('<ol style="margin-bottom: 0px; padding-inline-start: 48px;">') + 1,
        questions.lastIndexOf('</ol>'),
      );
      const start = '<span style="font-size: 11pt; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">';
      const end = '</span>';
      newQuestion.question.title = questionText!.split(start).pop()!.split(end)[0];
      const answersTextStart = '<ul style="margin-bottom: 0px; padding-inline-start: 48px;">';
      const answersTextEnd = '</ul>';
      const answersText = questions!.split(answersTextStart).pop()!.split(answersTextEnd)[0];
      const answers = answersText.split('</li>');
      answers.forEach((answer) => {
        const answerStart = '<span style="font-size: 11pt; background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">';
        const answerEnd = '</span>';
        if ( answer.includes('font-weight: 700;') ) {
          let prelim = answer!.split(answerStart).pop()!.split(answerEnd)[0];
          if ( prelim.includes('span') ) {
            const newSplit = '<span style="font-size: 11pt; background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">';
            const split = prelim.split(newSplit);
            prelim = split[split.length - 1];
          }
          newQuestion.question.answers.set(newQuestion.question.answers.size, prelim);
          newQuestion.answer = newQuestion.question.answers.size - 1;
        } else {
          const answerPrelim = answer!.split(answerStart).pop()!.split(answerEnd)[0];
          if ( answerPrelim !== '' ) {
            newQuestion.question.answers.set(newQuestion.question.answers.size, answerPrelim);
          }
        }
      });
      questionsList.push(newQuestion);
    });
    questionsList.forEach((question) => {
      if ( [...question.question.answers.entries()].findIndex((a) => a[1] === '') !== -1 ) {
        console.log(question);
      }
    });
    questionsList = questionsList.filter((question) => [...question.question.answers.entries()].findIndex((a) => a[1] === '') === -1);
    questionsList.forEach((question) => {
      this.db.pushQuestion(question);
    });
  }

}
