// import ExportService from '../services/export.service';
import { NextFunction, Request, Response } from 'express';
// import { write } from 'fast-csv';
// import { validate as uuidValidate } from 'uuid';
import HttpException from '../exceptions/HttpException';
import MetricsService from '../services/metrics.service';
import { logger } from '../utils/logger';

export default class MetricsHandler {
  metricsSvc = new MetricsService();

  getOverallStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    try {
      const results = await this.metricsSvc.getOverallMetrics(assessmentHurdleId);
      return res.json(results);
    } catch (err) {
      logger.error(err);
    }
  };
  getEvaluatorProgress = async (req: Request, res: Response) => {
    const { assessmentHurdleId } = req.params;
    const evaluatorId = req.user!.id;
    const evaluatorTotals = await this.metricsSvc.getEvaluatorTotals(assessmentHurdleId, evaluatorId);

    const applicantsEvaluatedByUser = evaluatorTotals
      ? +evaluatorTotals.pending_review! + +evaluatorTotals.pending_amendment! + +evaluatorTotals.completed!
      : 0;
    const { totalEvaluations, totalEvaluationsNeeded, totalApplicants } = await this.metricsSvc.getHiringActionAggregates(assessmentHurdleId);

    return res.json({
      totalEvaluated: totalEvaluations,
      totalEvaluationsNeeded,
      applicantsEvaluatedByUser,
      totalApplicants,
    });
  };
  // getAuditFile = async (req: Request, res: Response, next: NextFunction) => {
  //   // const { assessmentHurdleId } = req.params;
  //   // if (!assessmentHurdleId) {
  //   //   return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   // }
  //   // try {
  //   //   const data = await this.exportSvc.getAuditFile(assessmentHurdleId);
  //   //   if (req.params.format && req.params.format === 'json') {
  //   //     res.status(200).json({ data: data, message: 'getAuditFile' });
  //   //   } else {
  //   //     res.header('Content-Type', 'text/csv');
  //   //     const fileName = `Audit-${assessmentHurdleId}.csv`;
  //   //     res.attachment(fileName);
  //   //     write(data, {
  //   //       alwaysWriteHeaders: true,
  //   //       quote: true,
  //   //       writeHeaders: true,
  //   //       quoteColumns: true,
  //   //       quoteHeaders: false,
  //   //       headers: Object.keys(data[0]),
  //   //     }).pipe(res);
  //   //   }
  //   // } catch (error) {
  //   //   next(error);
  //   // }
  // };

  // getResultsFile = async (req: Request, res: Response, next: NextFunction) => {
  //   // const { assessmentHurdleId } = req.params;
  //   // if (!assessmentHurdleId) {
  //   //   return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   // }
  //   // try {
  //   //   const data = await this.exportSvc.getGeneralResult(assessmentHurdleId);
  //   //   if (req.params.format && req.params.format === 'json') {
  //   //     res.status(200).json({ data: data, message: 'getResultsFile' });
  //   //   } else {
  //   //     res.header('Content-Type', 'text/csv');
  //   //     const fileName = `Results-${assessmentHurdleId}.csv`;
  //   //     res.attachment(fileName);
  //   //     write(data, {
  //   //       alwaysWriteHeaders: true,
  //   //       quote: true,
  //   //       writeHeaders: true,
  //   //       quoteColumns: true,
  //   //       quoteHeaders: false,
  //   //       headers: Object.keys(data[0]),
  //   //     }).pipe(res);
  //   //   }
  //   // } catch (error) {
  //   //   next(error);
  //   // }
  // };

  // getUSASFile = async (req: Request, res: Response, next: NextFunction) => {
  //   // const { assessmentHurdleId } = req.params;
  //   // if (!assessmentHurdleId) {
  //   //   return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   // }
  //   // try {
  //   //   const data = await this.exportSvc.getUSASResult(assessmentHurdleId);
  //   //   if (req.params.format && req.params.format === 'json') {
  //   //     res.status(200).json({ data: data, message: 'getResultsFile' });
  //   //   } else {
  //   //     const formattedData = data.map(d => {
  //   //       return {
  //   //         'Vacancy ID': d.vacancyId,
  //   //         'Assessment ID': d.assessmentId,
  //   //         'Application ID': d.applicationId,
  //   //         'Application Rating ID': d.applicationRatingId,
  //   //         'Applicant Last Name': d.applicantLastName,
  //   //         'Applicant First Name': d.applicantFirstName,
  //   //         'Applicant Middle Name': d.applicantMiddleName,
  //   //         'Application Number': d.applicationNumber,
  //   //         'Rating Combination': d.ratingCombination,
  //   //         'Assessment Rating': d.assessmentRating,
  //   //         'Minimum Qualifications Rating': d.minQualificationsRating,
  //   //       };
  //   //     });
  //   //     res.header('Content-Type', 'text/csv');
  //   //     const fileName = `Applicants-${assessmentHurdleId}.csv`;
  //   //     res.attachment(fileName);
  //   //     write(formattedData, {
  //   //       alwaysWriteHeaders: true,
  //   //       quote: true,
  //   //       writeHeaders: true,
  //   //       quoteColumns: true,
  //   //       quoteHeaders: false,
  //   //       headers: true,
  //   //     }).pipe(res);
  //   //   }
  //   // } catch (error) {
  //   //   next(error);
  //   // }
  // };

  // getRecusedFile = async (req: Request, res: Response, next: NextFunction) => {
  //   // const { assessmentHurdleId } = req.params;
  //   // if (!assessmentHurdleId) {
  //   //   return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   // }
  //   // try {
  //   //   const data = await this.exportSvc.getRecusedApplicantsFile(assessmentHurdleId);
  //   //   if (req.params.format && req.params.format === 'json') {
  //   //     res.status(200).json({ data: data, message: 'getRecusedFile' });
  //   //   } else {
  //   //     res.header('Content-Type', 'text/csv');
  //   //     const fileName = `Recused-${assessmentHurdleId}.csv`;
  //   //     res.attachment(fileName);
  //   //     write(data, {
  //   //       alwaysWriteHeaders: true,
  //   //       quote: true,
  //   //       writeHeaders: true,
  //   //       quoteColumns: true,
  //   //       quoteHeaders: false,
  //   //       headers: Object.keys(data[0]),
  //   //     }).pipe(res);
  //   //   }
  //   // } catch (error) {
  //   //   next(error);
  //   // }
  // };

  // getFlaggedFile = async (req: Request, res: Response, next: NextFunction) => {
  //   //   const { assessmentHurdleId } = req.params;
  //   //   if (!assessmentHurdleId) {
  //   //     return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   //   }
  //   //   try {
  //   //     const data = await this.exportSvc.getFlaggedApplicantsFile(assessmentHurdleId);
  //   //     if (req.params.format && req.params.format === 'json') {
  //   //       res.status(200).json({ data: data, message: 'getFlaggedFile' });
  //   //     } else {
  //   //       res.header('Content-Type', 'text/csv');
  //   //       const fileName = `Flagged-${assessmentHurdleId}.csv`;
  //   //       res.attachment(fileName);
  //   //       write(data, {
  //   //         alwaysWriteHeaders: true,
  //   //         quote: true,
  //   //         writeHeaders: true,
  //   //         quoteColumns: true,
  //   //         quoteHeaders: false,
  //   //         headers: Object.keys(data[0]),
  //   //       }).pipe(res);
  //   //     }
  //   //   } catch (error) {
  //   //     next(error);
  //   //   }
  // };
}
