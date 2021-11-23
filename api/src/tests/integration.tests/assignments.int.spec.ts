import path from 'path';
import App from '../../app';
import AssessmentHurdleRoute from '../../routes/assessmenthurdle.routes';
import EvaluationRoute from '../../routes/evaluation.routes';
import IntegrationLoader from './util/integrationloader';
import st, { SuperTest, Test } from 'supertest';
import { ApplicationAssignments } from '../../models/application_assignments';

import EvalSubmission from './util/evaluationSubmission';

const integrationLoader = new IntegrationLoader(path.join(__dirname, './data/demoResumeSingleGrade'));
const assessmentRoute = new AssessmentHurdleRoute();
const evaluationRoute = new EvaluationRoute();
const application: App = new App(9999, 'testing', [assessmentRoute, evaluationRoute]);

/**
 * THESE TESTS ARE DESIGNED TO RUN SERIALLY
 */

describe('Basic assignment queue testing', () => {
  let request: SuperTest<Test>;
  let assessmentHurdleId: string;
  beforeAll(async done => {
    try {
      await application.serverReady;
      const testingData = await integrationLoader.loadTestingData(true, false);
      assessmentHurdleId = testingData.assessmentHurdleId;
      request = st(application!.getServer());
      done();
    } catch (err) {
      done(err);
    }
  });

  it('Assignment returns an applicant', async done => {
    const { status, body } = await request
      .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
      .set('Authorization', 'bearer evaluator_two')
      .send();

    expect(status).toEqual(200);
    const appAssignment = body.data as ApplicationAssignments;
    expect(appAssignment.applicant_id).toBeDefined();
    expect(appAssignment.assessment_hurdle_id).toEqual(assessmentHurdleId);
    done();
  });

  it('Multiple calls return the same applicant', async done => {
    let firstAssignment: ApplicationAssignments | null = null;
    {
      const { status, body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', 'bearer evaluator_two')
        .send();

      expect(status).toEqual(200);
      const appAssignment = body.data as ApplicationAssignments;
      firstAssignment = appAssignment;
    }
    {
      const { status, body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', 'bearer evaluator_two')
        .send();
      expect(status).toEqual(200);
      const appAssignment = body.data as ApplicationAssignments;
      expect(appAssignment.applicant_id).toEqual(firstAssignment!.applicant_id);
      done();
    }
  });

  it('Evaluation should remove applicant from queue', async done => {
    const evaluator = 'evaluator_two';
    const evalApplicant = new EvalSubmission(application);
    let firstAssignment: ApplicationAssignments | null = null;
    {
      const { status, body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      expect(status).toEqual(200);

      const appAssignment = body.data as ApplicationAssignments;
      firstAssignment = appAssignment;
    }
    let secondAssignment: ApplicationAssignments | null = null;
    {
      await evalApplicant.evaluatePassing(assessmentHurdleId, firstAssignment!.applicant_id, evaluator, 'Application Note');

      const { body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      secondAssignment = appAssignment;
      expect(appAssignment.applicant_id).not.toEqual(firstAssignment!.applicant_id);
    }
    {
      await evalApplicant.evaluateFailing(assessmentHurdleId, secondAssignment!.applicant_id, evaluator, 'This is an applicant failure note');

      const { body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      expect(appAssignment.applicant_id).not.toEqual(secondAssignment!.applicant_id);
    }
    done();
  });

  it('Flagged applicant should be removed from this applicants queue', async done => {
    let firstAssignment: ApplicationAssignments | null = null;
    const evaluator = 'evaluator_two';
    const evalApplicant = new EvalSubmission(application);
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      firstAssignment = appAssignment;
    }
    {
      const { body, status } = await evalApplicant.flagApplicant(assessmentHurdleId, firstAssignment!.applicant_id, evaluator, 'This is a flag note');
    }
    {
      const { status, body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      expect(status).toEqual(200);
      const appAssignment = body.data as ApplicationAssignments;
      expect(appAssignment.applicant_id).not.toBe(firstAssignment!.applicant_id);
      done();
    }
  });
  it('Recused applicant should be removed from this applicants queue', async done => {
    let firstAssignment: ApplicationAssignments | null = null;
    const evaluator = 'evaluator_two';
    const evalApplicant = new EvalSubmission(application);
    {
      const { body, status } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      const appAssignment = body.data as ApplicationAssignments;
      firstAssignment = appAssignment;
    }
    {
      const { body, status } = await evalApplicant.recuseApplicant(
        assessmentHurdleId,
        firstAssignment!.applicant_id,
        evaluator,
        'This is a recusal note',
      );
    }
    {
      const { status, body } = await request
        .get(`${assessmentRoute.fullBasePath}/${assessmentHurdleId}/next`)
        .set('Authorization', `bearer ${evaluator}`)
        .send();
      expect(status).toEqual(200);
      const appAssignment = body.data as ApplicationAssignments;
      expect(appAssignment.applicant_id).not.toBe(firstAssignment!.applicant_id);
      done();
    }
  });
});
