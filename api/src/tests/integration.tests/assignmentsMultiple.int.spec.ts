import path from 'path';
import App from '../../app';
import AssessmentHurdleRoute from '../../routes/assessmenthurdle.routes';
import EvaluationRoute from '../../routes/evaluation.routes';
import st, { SuperTest, Test } from 'supertest';
import { ApplicationAssignments } from '../../models/application_assignments';

import IntegrationLoader from './util/integrationloader';
import EvalSubmission from './util/evaluationSubmission';

const integrationLoader = new IntegrationLoader(path.join(__dirname, './data/demoResumeSingleGrade'));
const assessmentRoute = new AssessmentHurdleRoute();
const evaluationRoute = new EvaluationRoute();
const application: App = new App(9999, 'testing', [assessmentRoute, evaluationRoute]);

/**
 * THESE TESTS ARE DESIGNED TO RUN SERIALLY
 */

describe('Assignments requests where multiple evaluators are affected', () => {
  let assessmentHurdleId: string;
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
      done();
    } catch (err) {
      done(err);
    }
  });
  it('Different evaluators should get different applicants at queue start', async done => {
    let evalOnefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorOne = 'evaluator_one';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorOne}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalOnefirstAssignment = appAssignment;
    }
    let evalTwofirstAssignment: ApplicationAssignments | null = null;
    const evaluatorTwo = 'evaluator_two';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorTwo}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalTwofirstAssignment = appAssignment;
    }
    let evalThreefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorThree = 'evaluator_three';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorThree}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalThreefirstAssignment = appAssignment;
    }
    const ids = [evalOnefirstAssignment.applicant_id, evalTwofirstAssignment.applicant_id, evalThreefirstAssignment.applicant_id];
    const isArrayUnique = (arr: string[]) => Array.isArray(arr) && new Set(arr).size === arr.length;
    // expect(1).toBe(1);
    expect(isArrayUnique(ids)).toBeTruthy();
    return done();
  });
  it('Evaluating an applicant should make another evaluator prefer that applicant while removing it from the current evaluator queue', async done => {
    const evalApplicant = new EvalSubmission(application);

    let evalOnefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorOne = 'evaluator_one';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorOne}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalOnefirstAssignment = appAssignment;
      await evalApplicant.evaluateFailing(
        assessmentHurdleId,
        evalOnefirstAssignment!.applicant_id,
        evaluatorOne,
        'This is an applicant failure note',
      );
    }

    let evalTwofirstAssignment: ApplicationAssignments | null = null;
    const evaluatorTwo = 'evaluator_two';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorTwo}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalTwofirstAssignment = appAssignment;
    }
    expect(evalOnefirstAssignment.applicant_id).toEqual(evalTwofirstAssignment.applicant_id);

    let evalThreefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorThree = 'evaluator_three';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorThree}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalThreefirstAssignment = appAssignment;
    }
    // but evaluator three shouldn't get this applicant
    expect(evalThreefirstAssignment.applicant_id).not.toEqual(evalTwofirstAssignment.applicant_id);
    done();
  });
  it('Recusing an applicant should just remove the current evaluator, and make it the preference of the next evaluator', async done => {
    const evalApplicant = new EvalSubmission(application);

    let evalOnefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorOne = 'evaluator_one';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorOne}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalOnefirstAssignment = appAssignment;
      await evalApplicant.recuseApplicant(assessmentHurdleId, evalOnefirstAssignment!.applicant_id, evaluatorOne);
    }

    let evalTwofirstAssignment: ApplicationAssignments | null = null;
    const evaluatorTwo = 'evaluator_two';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorTwo}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalTwofirstAssignment = appAssignment;
    }
    expect(evalOnefirstAssignment.applicant_id).toEqual(evalTwofirstAssignment.applicant_id);

    let evalThreefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorThree = 'evaluator_three';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorThree}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalThreefirstAssignment = appAssignment;
    }
    // but evaluator three shouldn't get this applicant
    expect(evalThreefirstAssignment.applicant_id).not.toEqual(evalTwofirstAssignment.applicant_id);
    done();
  });
  it('Flagging an applicant should remove this applicant from all queues', async done => {
    const evalApplicant = new EvalSubmission(application);

    let evalOnefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorOne = 'evaluator_one';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorOne}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalOnefirstAssignment = appAssignment;
      await evalApplicant.flagApplicant(assessmentHurdleId, evalOnefirstAssignment!.applicant_id, evaluatorOne);
    }

    let evalTwofirstAssignment: ApplicationAssignments | null = null;
    const evaluatorTwo = 'evaluator_two';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorTwo}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalTwofirstAssignment = appAssignment;
    }
    expect(evalOnefirstAssignment.applicant_id).not.toEqual(evalTwofirstAssignment.applicant_id);

    let evalThreefirstAssignment: ApplicationAssignments | null = null;
    const evaluatorThree = 'evaluator_three';
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluatorThree}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      evalThreefirstAssignment = appAssignment;
    }
    // but evaluator three shouldn't get this applicant
    expect(evalOnefirstAssignment.applicant_id).not.toEqual(evalThreefirstAssignment.applicant_id);

    done();
  });
});
