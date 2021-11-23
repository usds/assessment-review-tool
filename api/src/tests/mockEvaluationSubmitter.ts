import App from '../app';
import AssessmentHurdleRoute from '../routes/assessmenthurdle.routes';
import EvaluationRoute from '../routes/evaluation.routes';
import request from 'supertest';
import { CompetencyWithSelectors } from '../dto/applicantdisplay.dto';
import { ApplicationEvaluation } from '../models/application_evaluation';
import { CompetencyEvaluation } from '../models/competency_evaluation';

export default class MockEvaluationSubmitter {
  assessmentRoute = new AssessmentHurdleRoute();
  evaluationRoute = new EvaluationRoute();
  application: App;

  constructor(existingApp: App | null) {
    this.application = existingApp ?? new App(9999, 'testing', [this.assessmentRoute, this.evaluationRoute]);
  }

  async submit(hurdleId: string, applicantId: string, evaluatorId: string): Promise<[ApplicationEvaluation[], CompetencyEvaluation[]]> {
    const displayUrl = `evaluation/${hurdleId}/display/${applicantId}`;
    const evalUrl = `evaluation/${hurdleId}/submit/${applicantId}`;

    return new Promise((reject, resolve) => {
      request(this.application.getServer())
        .get(displayUrl)
        .set('Authorization', 'bearer evaluator_two')
        .end((err, resp) => {
          if (err) {
            reject(err);
            return;
          }

          const data = resp.body.data.data;
          const competencies = data.competencies;
          const evalMap = competencies.map((comp: CompetencyWithSelectors) => {
            const yesSelector = comp.selectors.filter(compSelector => compSelector.display_name === 'Yes')[0];
            return {
              competencyId: comp.id,
              selectorId: yesSelector.id,
              note: 'Some Fancy Note',
            };
          });

          const sendingEval = {
            note: 'Application Note',
            evaluatorId: evaluatorId,
            competencyEvals: evalMap,
          };

          request(this.application.getServer())
            .put(evalUrl)
            .send(sendingEval)
            .set('Authorization', 'bearer evaluator_two')
            .end((err1, resp1) => {
              if (err1) {
                reject(err1);
                return;
              }
              resolve(resp1.body.data);
            });
        });
    });
  }
}
