process.env.NODE_ENV = 'development';
// process.env.APP_ENV = 'testing';

import path from 'path';
import App from '../../app';
import { AssessmentHurdle } from '../../models/assessment_hurdle';
import AssessmentHurdleRoute from '../../routes/assessmenthurdle.routes';
import EvaluationRoute from '../../routes/evaluation.routes';
import IntegrationLoader from './util/integrationloader';
import st, { SuperTest, Test } from 'supertest';
import { ApplicationAssignments } from '../../models/application_assignments';

import EvalSubmission, { evaluator } from './util/evaluationSubmission';

const integrationLoader = new IntegrationLoader(path.join(__dirname, './data/demoResumeSingleGrade'));
const assessmentRoute = new AssessmentHurdleRoute();
const evaluationRoute = new EvaluationRoute();
const application: App = new App(9999, 'testing', [assessmentRoute, evaluationRoute]);

describe('Queue exhaustion', () => {
  let assessmentHurdleId: string;
  let applicantCount: number;
  let applicantIds: string[];

  let request: SuperTest<Test>;
  beforeAll(async done => {
    try {
      await application.serverReady;
      request = st(application!.getServer());
      done();
    } catch (err) {
      done(err);
    }
  });
  beforeEach(async done => {
    try {
      await application.serverReady;
      const testingData = await integrationLoader.loadTestingData(true, true);
      assessmentHurdleId = testingData.assessmentHurdleId;
      applicantCount = testingData.applicantCount;
      applicantIds = testingData.applicantIds;
      done();
    } catch (err) {
      done(err);
    }
  });
  it('A single SME should be able to exhaust their queue', async done => {
    const evalApplicant = new EvalSubmission(application);

    const evaluator = 'evaluator_one';
    for (let evalsDone = 0; evalsDone < applicantCount; evalsDone++) {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      expect(appAssignment).toBeTruthy();
      expect(appAssignment.applicant_id).toBeTruthy();
      await evalApplicant.evaluatePassing(assessmentHurdleId, appAssignment.applicant_id, evaluator);
    }
    const { body, status } = await request
      .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
      .set('Authorization', `bearer ${evaluator}`)
      .send();
    const appAssignment = body.data;
    expect(appAssignment).toBe(null);

    return done();
  });
  it('Two evaluators should exaust the queue for a third given a "2 evaluator minimum" requirement', async done => {
    const evalApplicant = new EvalSubmission(application);

    {
      const evaluatorOne = 'evaluator_one';
      for (let evalsDone = 0; evalsDone < applicantCount; evalsDone++) {
        const { body, status } = await request
          .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
          .set('Authorization', `bearer ${evaluatorOne}`)
          .send();
        const appAssignment = body.data as ApplicationAssignments;
        expect(appAssignment).toBeTruthy();
        expect(appAssignment.applicant_id).toBeTruthy();
        await evalApplicant.evaluatePassing(assessmentHurdleId, appAssignment.applicant_id, evaluatorOne);
      }
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorOne}`)
        .send();
      const appAssignment = body.data;
      expect(appAssignment).toBe(null);
    }
    {
      const evaluatorTwo = 'evaluator_two';
      for (let evalsDone = 0; evalsDone < applicantCount; evalsDone++) {
        const { body, status } = await request
          .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
          .set('Authorization', `bearer ${evaluatorTwo}`)
          .send();
        const appAssignment = body.data as ApplicationAssignments;
        expect(appAssignment).toBeTruthy();
        expect(appAssignment.applicant_id).toBeTruthy();
        await evalApplicant.evaluatePassing(assessmentHurdleId, appAssignment.applicant_id, evaluatorTwo);
      }
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorTwo}`)
        .send();
      const appAssignment = body.data;
      expect(appAssignment).toBe(null);
    }
    {
      const evaluatorThree = 'evaluator_three';

      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorThree}`)
        .send();
      const appAssignment = body.data;
      expect(appAssignment).toBe(null);
    }
    return done();
  });
  it('Two evaluators should create tie breakers for a third evaluator when reviewing', async done => {
    /**
     * set up testing
     */
    const evalApplicant = new EvalSubmission(application);

    const evalMap = applicantIds.reduce((localEvalMap, applicantId, idx) => {
      let evalOrder: ('pass' | 'fail' | null | 'recuse' | 'flag')[];
      let evaluatorsDone: boolean[];
      switch (idx) {
        case 0:
          evalOrder = ['pass', 'fail', 'pass', null, null];
          evaluatorsDone = [false, false, false, true, true];
          break;
        case 1:
          evalOrder = ['fail', 'pass', 'fail', null, null];
          evaluatorsDone = [false, false, false, true, true];

          break;
        case 2:
          evalOrder = ['pass', 'fail', 'recuse', 'pass', null];
          evaluatorsDone = [false, false, false, false, true];

          break;
        case 3:
          evalOrder = ['pass', 'recuse', 'pass', null, null];
          evaluatorsDone = [false, false, false, true, true];

          break;
        case 4:
          evalOrder = ['fail', 'recuse', 'pass', 'fail', null];
          evaluatorsDone = [false, false, false, false, true];

          break;
        case 5:
          evalOrder = ['pass', 'recuse', 'flag', null, null];
          evaluatorsDone = [false, false, false, true, true];

          break;
        case 6:
          evalOrder = ['fail', 'recuse', 'fail', null, null];
          evaluatorsDone = [false, false, false, true, true];

          break;
        case 6:
          evalOrder = ['fail', 'fail', null, null, null];
          evaluatorsDone = [false, false, true, true, true];

          break;
        default:
          evalOrder = ['pass', 'pass', null, null, null];
          evaluatorsDone = [false, false, true, true, true];

          break;
      }
      localEvalMap[applicantId] = { evalOrder, evaluatorsDone };
      return localEvalMap;
    }, {} as { [applicantId: string]: { evaluatorsDone: boolean[]; evalOrder: ('pass' | 'fail' | null | 'recuse' | 'flag')[] } });

    async function evaluateApplicants(evaluator: evaluator, evaluatorIdx: number) {
      const applicantCountForEvaluator = Object.values(evalMap).map(a => a.evaluatorsDone[evaluatorIdx]).length;
      for (let evalsDone = 0; evalsDone < applicantCountForEvaluator; evalsDone++) {
        const { body, status } = await request
          .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
          .set('Authorization', `bearer ${evaluator}`)
          .send();
        const appAssignment = body.data as ApplicationAssignments;
        if (appAssignment) {
          const evalType = evalMap[appAssignment.applicant_id].evalOrder[evaluatorIdx];
          const evalStatus = evalMap[appAssignment.applicant_id].evaluatorsDone[evaluatorIdx];
          expect(evalType).not.toBe(null);
          expect(evalStatus).toBe(false);

          switch (evalType) {
            case 'pass':
              await evalApplicant.evaluatePassing(assessmentHurdleId, appAssignment.applicant_id, evaluator);
              break;
            case 'fail':
              await evalApplicant.evaluateFailing(assessmentHurdleId, appAssignment.applicant_id, evaluator);
              break;
            case 'recuse':
              await evalApplicant.recuseApplicant(assessmentHurdleId, appAssignment.applicant_id, evaluator);
              break;
            case 'flag':
              await evalApplicant.flagApplicant(assessmentHurdleId, appAssignment.applicant_id, evaluator);
              break;
          }
          evalMap[appAssignment.applicant_id].evaluatorsDone[evaluatorIdx] = true;
        }
      }
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      const appAssignment = body.data;
      expect(appAssignment).toBe(null);
      return;
    }
    await evaluateApplicants('evaluator_one', 0);
    await evaluateApplicants('evaluator_two', 1);
    await evaluateApplicants('evaluator_three', 2);
    await evaluateApplicants('evaluator_four', 3);
    await evaluateApplicants('evaluator_five', 4);
    return done();
  });
});
