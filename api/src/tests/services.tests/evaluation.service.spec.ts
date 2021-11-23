process.env.NODE_ENV = 'testing';
process.env.APP_ENV = 'testing';

import { EvaluationApplicationReviewSubmitDto } from '../../dto/evaluationreviewsubmit.dto';
import EvaluationSubmitDto from '../../dto/evaluationsubmit.dto';
import HttpException from '../../exceptions/HttpException';
import { Applicant } from '../../models/applicant';
import { AssessmentHurdleUser } from '../../models/assessment_hurdle_user';
import EvaluationService from '../../services/evaluation.service';
import { EvaluationMocks } from './evaluationmocks';
import MockDB from '../mockDB';

//#region jest mock
jest.mock('../../models/application');
jest.mock('../../models/application_assignments');
jest.mock('../../models/application_evaluation');
jest.mock('../../models/application_evaluation_competency');
jest.mock('../../models/applicant_evaluation_feedback');
jest.mock('../../models/competency');
jest.mock('../../models/competency_evaluation');
jest.mock('../../models/competency_selectors');
jest.mock('../../models/specialty');
jest.mock('../../models/specialty_competencies');
jest.mock('../../models/applicant');
jest.mock('../../database');
//#endregion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbInstance = new MockDB();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('submitEvaluation Tests', () => {
  it('full submission works', async () => {
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const body: EvaluationSubmitDto = {
      note: 'Experience is good.',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
          note: 'passed with flying colors',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 20,
        sort_order: 1,
      },
    ];
    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: assessmentHurdleId,
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: assessmentHurdleId,
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationReturnOf1(applications[0].id)
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: assessmentHurdleId,
        },
      ]);

    const svc = new EvaluationService();

    const [appEval, compEval] = await svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId);
    expect(appEval.length).toEqual(1);
    expect(compEval.length).toEqual(1);
  });

  it('full submission creates correct number of evaluations', async () => {
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const body: EvaluationSubmitDto = {
      note: 'Experience is good.',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
          note: 'passed with flying colors',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
      {
        id: '3b6b18ec-bd1c-4d4c-ba93-d93c1146dc83',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 20,
        sort_order: 1,
      },
    ];
    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: assessmentHurdleId,
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: assessmentHurdleId,
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationPassthroughReturn()
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: assessmentHurdleId,
        },
      ]);

    const svc = new EvaluationService();
    const [appEval, compEval] = await svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId);

    expect(appEval.length).toEqual(2);
    expect(compEval.length).toEqual(1);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applications);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.competencySelectors);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluations);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluationComps);
  });

  it('competency counts off should throw 400', async () => {
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const body: EvaluationSubmitDto = {
      note: 'Experience is good.',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
          note: 'passed with flying colors',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 20,
        sort_order: 1,
      },
      {
        id: '376eb971-0bc3-4251-80ce-33b4a434f124',
        competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
        default_text: 'Default Text 2',
        display_name: 'Selector Default 2',
        point_value: 10,
        sort_order: 2,
      },
    ];

    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: assessmentHurdleId,
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: assessmentHurdleId,
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
          {
            id: '3cb28109-222f-4e8a-9129-1001914c17b6',
            competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationReturnOf1(applications[0].id)
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: assessmentHurdleId,
        },
      ]);
    const svc = new EvaluationService();
    await expect(svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId)).rejects.toThrowError(HttpException);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applications);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.competencySelectors);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluations, 0);
  });
  it('missing competency should throw 400', async () => {
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const body: EvaluationSubmitDto = {
      note: 'Experience is good.',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
          note: 'passed with flying colors',
        },
        {
          competencyId: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
          selectorId: '376eb971-0bc3-4251-80ce-33b4a434f124',
          note: 'passed with flying colors',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 20,
        sort_order: 1,
      },
      {
        id: '376eb971-0bc3-4251-80ce-33b4a434f124',
        competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
        default_text: 'Default Text 2',
        display_name: 'Selector Default 2',
        point_value: 10,
        sort_order: 2,
      },
      {
        id: 'e871eb61-2465-41ff-92f4-2c11f4135ff2',
        competency_id: 'b7931ade-0d1a-4800-9dea-b6f3b1fc1ab6',
        default_text: 'Default Text 3',
        display_name: 'Selector Default 3',
        point_value: 11,
        sort_order: 3,
      },
    ];

    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: assessmentHurdleId,
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: 'ec12d26a-9529-4b2e-a006-a57465af1f3e',
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
          {
            id: '3cb28109-222f-4e8a-9129-1001914c17b6',
            competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
          {
            id: '2ecf00f0-8ad5-4f2a-865b-24294d0c6b51',
            competency_id: 'b7931ade-0d1a-4800-9dea-b6f3b1fc1ab6',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationReturnOf1(applications[0].id)
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: 'ae479190-8e18-458e-a68f-0d6a89a87b2b',
        },
      ]);
    const svc = new EvaluationService();
    await expect(svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId)).rejects.toThrowError(HttpException);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applications);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.competencySelectors);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluations, 0);
  });
  it('missing review for failing competency throw 400', async () => {
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const body: EvaluationSubmitDto = {
      note: 'Experience is good.',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
          note: 'passed with flying colors',
        },
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: '376eb971-0bc3-4251-80ce-33b4a434f124',
          note: '',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 20,
        sort_order: 1,
      },
      {
        id: '376eb971-0bc3-4251-80ce-33b4a434f124',
        competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
        default_text: 'Meet L33t',
        display_name: 'Meet',
        point_value: 1,
        sort_order: 2,
      },
    ];

    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: 'ec12d26a-9529-4b2e-a006-a57465af1f3e',
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: 'ec12d26a-9529-4b2e-a006-a57465af1f3e',
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
          {
            id: '3cb28109-222f-4e8a-9129-1001914c17b6',
            competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationReturnOf1(applications[0].id)
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: 'ae479190-8e18-458e-a68f-0d6a89a87b2b',
        },
      ]);
    const svc = new EvaluationService();
    await expect(svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId)).rejects.toThrowError(HttpException);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applications);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.competencySelectors);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluations, 0);
  });
  it('missing review for a failing specialty throw 400', async () => {
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const body: EvaluationSubmitDto = {
      note: '',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
          note: 'passed with flying colors',
        },
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: '376eb971-0bc3-4251-80ce-33b4a434f124',
          note: 'Did not show how to do 1 + 1!',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 10,
        sort_order: 1,
      },
      {
        id: '376eb971-0bc3-4251-80ce-33b4a434f124',
        competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
        default_text: 'Does Not Meet L33t',
        display_name: 'Does Not Meet',
        point_value: 0,
        sort_order: 2,
      },
    ];

    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: assessmentHurdleId,
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: 'ec12d26a-9529-4b2e-a006-a57465af1f3e',
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
          {
            id: '3cb28109-222f-4e8a-9129-1001914c17b6',
            competency_id: '716c9aac-c2ff-4436-b270-ea3f453d6fdd',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationReturnOf1(applications[0].id)
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: 'ae479190-8e18-458e-a68f-0d6a89a87b2b',
        },
      ]);
    const svc = new EvaluationService();
    await expect(svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId)).rejects.toThrowError(HttpException);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applications);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.competencySelectors);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluations, 0);
  });
  it('competency missing selector throw 500', async () => {
    const applicantId = 'ea2092bf-a290-4695-bd1e-cbbe442c621e';
    const assessmentHurdleId = 'ec12d26a-9529-4b2e-a006-a57465af1f3e';
    const evaluatorId = 'fc81850e-1bbd-4e28-98ed-7d91dfe86b38';
    const body: EvaluationSubmitDto = {
      note: 'Experience is good.',
      evaluatorId,
      competencyEvals: [
        {
          competencyId: '6fa17c61-c995-4776-9450-43e780ce4869',
          selectorId: '1cbbda39-939b-4dc2-9e6b-3d86abbf5a2e',
          note: 'passed with flying colors',
        },
      ],
    };
    const applications = [
      {
        id: 'd84f9a55-80b1-445e-a52b-b98d396de520',
        applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
        specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
      },
    ];
    const compSelectors = [
      {
        id: 'dcb4e5cf-0b8a-41a4-94dd-fda5c74e4755',
        competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
        default_text: 'Default Text',
        display_name: 'Selector Default',
        point_value: 20,
        sort_order: 1,
      },
    ];
    const competency = {
      id: '6fa17c61-c995-4776-9450-43e780ce4869',
      local_id: 'testComp1',
      name: 'Test Comp 1',
      definition: ' Ye[p',
      assessment_hurdle_id: assessmentHurdleId,
      display_type: 1,
      required_proficiency_definition: 'L33t',
      screen_out: false,
    };

    const mocker = new EvaluationMocks()
      .setCompetencyReturns([competency])
      .setTempApplicant()
      .setApplicationsReturn(
        applications,
        {
          id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          local_id: 'testSpec1',
          name: 'Test Spec 1',
          assessment_hurdle_id: 'ec12d26a-9529-4b2e-a006-a57465af1f3e',
          points_required: 20,
        },
        [
          {
            id: '3e0b841f-09f3-433b-9403-024ca1fe0fb3',
            competency_id: '6fa17c61-c995-4776-9450-43e780ce4869',
            specialty_id: 'a256a733-ba09-446c-a3c7-59ca19e09e43',
          },
        ],
      )
      .setCompetencySelectorsReturn(compSelectors);
    mocker
      .setApplicationEvaluationReturnOf1(applications[0].id)
      .setCompetencyEvalutionsReturnOf1(competency.id, compSelectors[0].id)
      .setApplicationEvalComptencyReturn({
        id: 'c4f1e8ab-daa3-4e1a-8c86-88e7cfaeceaf',
        application_evaluation_id: 'd542b471-6ad9-42f4-8fbd-334eab7e34e7',
        competency_evaluation_id: '5ea8b22d-d61d-44bd-95af-cf53ca05b648',
      })
      .setApplicationAssignmentReturn([
        {
          applicant_id: 'ea2092bf-a290-4695-bd1e-cbbe442c621e',
          evaluator_id: '044bb051-2de5-4bca-a3ab-d5653b772995',
          id: 'ec3c98fd-3d8c-4802-97e2-18e85215dc79',
          active: false,
          assessment_hurdle_id: 'ae479190-8e18-458e-a68f-0d6a89a87b2b',
        },
      ]);

    const svc = new EvaluationService();
    const [appEval, compEval] = await svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId);
    expect(appEval.length).toEqual(1);
    expect(compEval.length).toEqual(1);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applications);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.competencySelectors);
    mocker.expectMockToBeCalled(EvaluationMocks.MockName.applicationEvaluations, 1);
  });

  it('not found applicant throws 404', async () => {
    const mockFindByPk = jest.fn();
    const assessmentHurdleId = '';
    const evaluatorId = 'f3861704-923e-49ac-8a76-845f0745ad06';
    mockFindByPk.mockReturnValue(undefined);
    Applicant.findByPk = mockFindByPk;

    const applicantId = 'bda70bd1-4e6f-4a60-97a9-aa03a1a0ddd9';
    const body: EvaluationSubmitDto = {
      evaluatorId: 'f3861704-923e-49ac-8a76-845f0745ad06',
      note: '',
      competencyEvals: [],
    };
    const svc = new EvaluationService();
    await expect(svc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId)).rejects.toThrowError(HttpException);
  });
});
