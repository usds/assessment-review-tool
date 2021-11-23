import CreateApplicationDto from '../dto/createapplication.dto';
import HttpException from '../exceptions/HttpException';
import { Application } from '../models/application';
import { ApplicationMeta } from '../models/application_meta';
import { isEmpty } from '../utils/isEmpty';
import { logger } from '../utils/logger';

export default class ApplicationService {
  async getById(id: string): Promise<Application> {
    if (isEmpty(id)) throw new HttpException(400, "You're not ApplicationId");
    const rst = await Application.findByPk(id);
    if (!rst) throw new HttpException(404, 'Not Found');
    return rst;
  }
  async getByIdWithMeta(id: string): Promise<[Application, ApplicationMeta]> {
    if (isEmpty(id)) throw new HttpException(400, "You're not ApplicationId");
    const rst = await Application.findByPk(id, { include: [ApplicationMeta as any], rejectOnEmpty: false });
    if (!rst) throw new HttpException(404, 'Not Found');
    const meta = await rst.getApplicationMetum();
    return [rst, meta];
  }

  async getAllByApplicantId(id: string): Promise<Application[]> {
    if (isEmpty(id)) throw new HttpException(400, 'Applicant not found');
    const rst: Application[] = await Application.findAll({
      where: { applicant_id: id },
      order: [['created_at', 'DESC']],
    });
    return rst;
  }

  async getAllBySpecialtyId(id: string): Promise<Application[]> {
    if (isEmpty(id)) throw new HttpException(400, 'Applicant or specialty not found');
    const rst: Application[] = await Application.findAll({
      where: { specialty_id: id },
      order: [['created_at', 'DESC']],
    });
    return rst;
  }

  async upsert(body: CreateApplicationDto): Promise<Application> {
    const [instance] = await Application.upsert({
      id: body.existingId,
      applicant_id: body.applicantId,
      specialty_id: body.specialtyId,
    });
    logger.debug(`Upserted Application ${instance.id}`);

    const [meta, created] = await ApplicationMeta.findOrCreate({
      where: { application_id: instance.id },
      defaults: {
        staffing_application_rating_id: body.applicationMetaId,
        staffing_assessment_id: body.applicationMetaAssessmentId,
        staffing_rating_combination: body.applicationMetaRatingCombination,
        application_id: instance.id,
      },
    });

    if (!created) {
      meta.update({
        staffing_application_rating_id: body.applicationMetaId,
        staffing_assessment_id: body.applicationMetaAssessmentId,
        staffing_rating_combination: body.applicationMetaRatingCombination,
        application_id: instance.id,
      });
    }

    logger.debug(`Upserted ApplicationMeta ${meta.id}`);

    return instance;
  }

  async createMapping(applicantId: string, specialtyId: string): Promise<Application> {
    if (isEmpty(applicantId) || isEmpty(specialtyId)) throw new HttpException(400, 'Applicant or specialty not found');
    const [created] = await Application.findOrCreate({
      where: { applicant_id: applicantId, specialty_id: specialtyId },
      defaults: {
        applicant_id: applicantId,
        specialty_id: specialtyId,
      },
    });
    return created;
  }

  async deleteMappingById(id: string): Promise<boolean> {
    if (isEmpty(id)) throw new HttpException(400, "You're not ApplicationId");
    const rst = await Application.destroy();
    return rst > 0;
  }
}
