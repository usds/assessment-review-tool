import { Applicant, ApplicantAttributes } from '../../models/applicant';
import { Application, ApplicationAttributes } from '../../models/application';
import { ApplicationAssignments, ApplicationAssignmentsAttributes } from '../../models/application_assignments';
import { ApplicationEvaluation, ApplicationEvaluationAttributes } from '../../models/application_evaluation';
import { ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyAttributes } from '../../models/application_evaluation_competency';
import { Competency, CompetencyAttributes } from '../../models/competency';
import { CompetencyEvaluation, CompetencyEvaluationAttributes } from '../../models/competency_evaluation';
import { CompetencySelectors, CompetencySelectorsAttributes } from '../../models/competency_selectors';
import { SpecialtyAttributes } from '../../models/specialty';
import { SpecialtyCompetenciesAttributes } from '../../models/specialty_competencies';

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
//#endregion

export class EvaluationMocks {
  mocks: Record<EvaluationMocks.MockName, any> = {
    [EvaluationMocks.MockName.applications]: jest.fn(),
    [EvaluationMocks.MockName.competencySelectors]: jest.fn(),
    [EvaluationMocks.MockName.competencies]: jest.fn(),
    [EvaluationMocks.MockName.competency]: jest.fn(),
    [EvaluationMocks.MockName.applicationEvaluations]: jest.fn(),
    [EvaluationMocks.MockName.competencyEvaluations]: jest.fn(),
    [EvaluationMocks.MockName.applicationEvaluationComps]: jest.fn(),
    [EvaluationMocks.MockName.applicationsAssignments]: jest.fn(),
    [EvaluationMocks.MockName.applicantOne]: jest.fn(),
  };

  constructor() {
    this.initMethods();
  }
  initMethods() {
    Application.findAll = this.mocks[EvaluationMocks.MockName.applications];
    CompetencySelectors.findAll = this.mocks[EvaluationMocks.MockName.competencySelectors];
    ApplicationEvaluation.bulkCreate = this.mocks[EvaluationMocks.MockName.applicationEvaluations];
    CompetencyEvaluation.bulkCreate = this.mocks[EvaluationMocks.MockName.competencyEvaluations];
    ApplicationEvaluationCompetency.bulkCreate = this.mocks[EvaluationMocks.MockName.applicationEvaluationComps];
    ApplicationAssignments.update = this.mocks[EvaluationMocks.MockName.applicationsAssignments];
    Applicant.findByPk = this.mocks[EvaluationMocks.MockName.applicantOne];
    Competency.findAll = this.mocks[EvaluationMocks.MockName.competencies];
    Competency.findByPk = this.mocks[EvaluationMocks.MockName.competency];
  }

  expectMockToBeCalled(mockName: EvaluationMocks.MockName, num = 1) {
    const mck = this.mocks[mockName];
    if (num === 0) expect(mck).not.toBeCalled();
    else expect(mck).toBeCalledTimes(num);
  }

  setCompetencyReturn(comp: CompetencyAttributes): this {
    this.mocks[EvaluationMocks.MockName.competency].mockReturnValue(comp);
    return this;
  }

  setCompetencyReturns(comps: CompetencyAttributes[]): this {
    this.mocks[EvaluationMocks.MockName.competencies].mockReturnValue(comps);
    return this;
  }

  setApplicationsReturn(apps: ApplicationAttributes[], specialty: SpecialtyAttributes, specComps: SpecialtyCompetenciesAttributes[]): this {
    const specCompsMapped = specComps.map(sc => {
      return {
        id: sc.id,
        specialty_id: sc.specialty_id,
        competency_id: sc.competency_id,
        Competency: this.mocks[EvaluationMocks.MockName.competency],
        getCompetency: this.mocks[EvaluationMocks.MockName.competency],
      };
    });

    const specialtyMap = {
      id: specialty.id,
      local_id: specialty.local_id,
      assessment_hurdle_id: specialty.assessment_hurdle_id,
      name: specialty.name,
      points_required: specialty.points_required,
      created_at: specialty.created_at,
      updated_at: specialty.updated_at,
      SpecialtyCompetencies: specCompsMapped,
      getSpecialtyCompetencies: () => {
        return specCompsMapped;
      },
    };

    const transformed = apps.map(a => {
      return {
        id: a.id,
        applicant_id: a.applicant_id,
        specialty_id: a.specialty_id,
        created_at: a.created_at,
        updated_at: a.updated_at,
        Specialty: specialtyMap,
        getSpecialty: () => {
          return specialtyMap;
        },
      };
    });
    this.mocks[EvaluationMocks.MockName.applications].mockReturnValue(transformed);
    return this;
  }

  setCompetencySelectorsReturn(selectors: CompetencySelectorsAttributes[]): this {
    this.mocks[EvaluationMocks.MockName.competencySelectors].mockReturnValue(selectors);
    return this;
  }

  setApplicationEvalutionsReturn(appEvals: ApplicationEvaluationAttributes[]): this {
    this.mocks[EvaluationMocks.MockName.applicationEvaluations].mockReturnValue(appEvals);
    return this;
  }

  setApplicationEvaluationPassthroughReturn(): this {
    this.mocks[EvaluationMocks.MockName.applicationEvaluations].mockImplementation((props: any) => props);
    return this;
  }

  setApplicationEvaluationReturnOf1(applicationId: string): this {
    this.mocks[EvaluationMocks.MockName.applicationEvaluations].mockReturnValue([
      {
        id: '675710c7-6969-4496-8070-53f4a86f466e',
        evaluation_note: 'string',
        evaluator: 'string',
        approved: false,
        approver_id: undefined,
        feedback_timestamp: new Date(),
        application_id: applicationId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    return this;
  }
  setCompetencyEvalutionsReturn(compEvals: CompetencyEvaluationAttributes[]): this {
    this.mocks[EvaluationMocks.MockName.competencyEvaluations].mockReturnValue(compEvals);
    return this;
  }
  setCompetencyEvalutionsReturnOf1(compId: string, selectorId: string): this {
    this.mocks[EvaluationMocks.MockName.competencyEvaluations].mockReturnValue([
      {
        id: '2bad8d90-b00d-4fa1-bfa5-09e243362669',
        evaluation_note: 'string',
        evaluator: '62589232-bfb0-4063-9826-26070999eb2a',
        competency_id: compId,
        competency_selector_id: selectorId,
        approved: false,
        approver_id: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    return this;
  }

  setCompetencyEvaluationPassThroughReturn(): this {
    this.mocks[EvaluationMocks.MockName.competencyEvaluations].mockImplementation((props: any) => props);
    return this;
  }
  setApplicationEvalComptencyReturn(mappings: ApplicationEvaluationCompetencyAttributes): this {
    this.mocks[EvaluationMocks.MockName.applicationEvaluationComps].mockReturnValue(mappings);
    return this;
  }

  setApplicationAssignmentReturn(assignments: ApplicationAssignmentsAttributes[]): this {
    this.mocks[EvaluationMocks.MockName.applicationsAssignments].mockReturnValue([assignments.length, assignments]);
    return this;
  }

  setTempApplicant(): this {
    this.mocks[EvaluationMocks.MockName.applicantOne].mockReturnValue({
      id: 'ea24be2f-f038-4c18-ab2f-f61771945d9c',
      name: 'string',
      flag_type: 0,
      flag_message: 'string',
      assessment_hurdle_id: '004a7bb6-509a-4c95-9652-485053c22398',
      additional_note: 'string',
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this;
  }

  setApplicant(applicant: ApplicantAttributes): this {
    this.mocks[EvaluationMocks.MockName.applicantOne].mockReturnValue(applicant);
    return this;
  }
}
export namespace EvaluationMocks {
  export enum MockName {
    applications,
    competencySelectors,
    competencies,
    competency,
    applicationEvaluations,
    competencyEvaluations,
    applicationEvaluationComps,
    applicationsAssignments,
    applicantOne,
  }
}
