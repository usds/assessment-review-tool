import request, { SuperTest, Test } from 'supertest';

import App from '../../../app';
import EvaluationRoute from '../../../routes/evaluation.routes';
import { CompetencyWithSelectors } from '../../../dto/applicantdisplay.dto';
export type evaluator = 'evaluator_one' | 'evaluator_two' | 'evaluator_three' | 'evaluator_four' | 'evaluator_five';
export default class EvalSubmission {
  evaluationRoute = new EvaluationRoute();
  application: App;
  request: SuperTest<Test>;

  constructor(existingApp: App | null) {
    this.application = existingApp ?? new App(9751, 'testing', [this.evaluationRoute]);
    this.request = request(this.application.getServer());
  }
  async flagApplicant(hurdleId: string, applicantId: string, evaluator: evaluator, flagNote = 'Flag message') {
    const flagUrl = `/api/evaluation/${hurdleId}/flag/${applicantId}`;
    return await this.request.post(flagUrl).set('Authorization', `bearer ${evaluator}`).send({
      flagMessage: flagNote,
    });
  }
  async recuseApplicant(hurdleId: string, applicantId: string, evaluator: evaluator, recuseNote = 'This is a recusal note') {
    const recuseUrl = `/api/evaluation/${hurdleId}/recuse/${applicantId}`;
    return await this.request.put(recuseUrl).set('Authorization', `bearer ${evaluator}`).send();
  }
  async evaluateFailing(hurdleId: string, applicantId: string, evaluator: evaluator, failingNote = 'Failing competency note') {
    const failingComps = [];
    let i = 0;
    // What are you doing reviewing more than 15 comps?
    while (i < 15) {
      failingComps.push(i++);
    }
    return await this.evaluateApplicant(hurdleId, applicantId, evaluator, failingComps, [], failingNote);
  }

  async evaluatePassing(hurdleId: string, applicantId: string, evaluator: evaluator, note = 'Application Note') {
    const passingComps = [];
    let i = 0;
    // What are you doing reviewing more than 15 comps?
    while (i < 15) {
      passingComps.push(i++);
    }
    return await this.evaluateApplicant(hurdleId, applicantId, evaluator, [], passingComps, '', note);
  }
  async evaluateApplicant(
    hurdleId: string,
    applicantId: string,
    evaluator: evaluator,
    failureCompIdxs: number[],
    passCompIdxs: number[] = [],
    failureNote = '',
    applicantNote = '',
  ): Promise<{ applicant: string; applicantPass: boolean }> {
    const displayUrl = `/api/evaluation/${hurdleId}/display/${applicantId}`;
    const evalUrl = `/api/evaluation/${hurdleId}/submit/${applicantId}`;
    let applicantPass = true;
    return new Promise((resolve, reject) => {
      this.request
        .get(displayUrl)
        .set('Authorization', `bearer ${evaluator}`)
        .end((err, resp) => {
          if (err) {
            reject(err);
            return;
          }

          const competenciesRaw = resp.body.data.competencies as CompetencyWithSelectors[];
          const competencies = competenciesRaw.sort((a, b) => a.name.localeCompare(b.name));

          const evalMap = competencies
            .map((comp: CompetencyWithSelectors, idx) => {
              if (failureCompIdxs.includes(idx)) {
                const noSelector =
                  comp.selectors.find(compSelector => compSelector.display_name === 'No evidence of this competency') ||
                  comp.selectors.find(compSelector => compSelector.display_name === 'No');
                applicantPass = false;
                return {
                  competencyId: comp.id,
                  selectorId: noSelector!.id,
                  note: failureNote,
                };
              }
              if (passCompIdxs.includes(idx)) {
                const yesSelector = comp.selectors.find(compSelector => compSelector.display_name === 'Yes');
                return {
                  competencyId: comp.id,
                  selectorId: yesSelector!.id,
                };
              }
              return null;
            })
            .filter(a => a);

          const sendingEval = {
            note: '',
            competencyEvals: evalMap,
          };
          if (applicantNote) {
            sendingEval.note = applicantNote;
          }

          this.request
            .put(evalUrl)
            .send(sendingEval)
            .set('Authorization', `bearer ${evaluator}`)
            .end((err1, resp1) => {
              if (err1) {
                reject(err1);
                return;
              }
              resolve({ applicant: applicantId, applicantPass });
            });
        });
    });
  }
}
