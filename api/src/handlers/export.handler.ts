import ExportService from '../services/export.service';
import { NextFunction, Request, Response } from 'express';
import { write } from 'fast-csv';
import { validate as uuidValidate } from 'uuid';
import HttpException from '../exceptions/HttpException';

export default class ExportHandler {
  exportSvc = new ExportService();

  getAuditFile = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }

    try {
      const evaluations = await this.exportSvc.getAuditFile(assessmentHurdleId);
      const recused = await this.exportSvc.getRecusedApplicants(assessmentHurdleId);
      const data = evaluations.concat(recused);
      if (req.params.format && req.params.format === 'json') {
        res.status(200).json({ data: data, message: 'getAuditFile' });
      } else {
        res.header('Content-Type', 'text/csv');
        const fileName = `Audit-${assessmentHurdleId}.csv`;
        res.attachment(fileName);
        write(data, {
          alwaysWriteHeaders: true,
          quote: true,
          writeHeaders: true,
          quoteColumns: true,
          quoteHeaders: false,
          headers: Object.keys(data[0]),
        })
          .pipe(res)
          .on('end', () => {
            res.end();
          });
      }
    } catch (error) {
      next(error);
    }
  };

  getResultsFile = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }

    try {
      const data = await this.exportSvc.getGeneralResult(assessmentHurdleId);
      if (req.params.format && req.params.format === 'json') {
        res.status(200).json({ data: data, message: 'getResultsFile' });
      } else {
        res.header('Content-Type', 'text/csv');
        const fileName = `Results-${assessmentHurdleId}.csv`;
        res.attachment(fileName);
        write(data, {
          alwaysWriteHeaders: true,
          quote: true,
          writeHeaders: true,
          quoteColumns: true,
          quoteHeaders: false,
          headers: Object.keys(data[0]),
        }).pipe(res);
      }
    } catch (error) {
      next(error);
    }
  };

  getUSASFile = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    try {
      const data = await this.exportSvc.getUSASResult(assessmentHurdleId);
      if (req.params.format && req.params.format === 'json') {
        res.status(200).json({ data: data, message: 'getResultsFile' });
      } else {
        const formattedData = data.map(d => {
          return {
            'Vacancy ID': d.vacancyId,
            'Assessment ID': d.assessmentId,
            'Application ID': d.applicationId,
            'Application Rating ID': d.applicationRatingId,
            'Applicant Last Name': d.applicantLastName,
            'Applicant First Name': d.applicantFirstName,
            'Applicant Middle Name': d.applicantMiddleName,
            'Application Number': d.applicationNumber,
            'Rating Combination': d.ratingCombination,
            'Assessment Rating': d.assessmentRating,
            'Minimum Qualifications Rating': d.minQualificationsRating,
          };
        });

        res.header('Content-Type', 'text/csv');
        const fileName = `Applicants-${assessmentHurdleId}.csv`;
        res.attachment(fileName);
        write(formattedData, {
          alwaysWriteHeaders: true,
          quote: true,
          writeHeaders: true,
          quoteColumns: true,
          quoteHeaders: false,
          headers: true,
        })
          .pipe(res)
          .on('end', () => {
            res.end();
          });
      }
    } catch (error) {
      next(error);
    }
  };

  // getRecusedFile = async (req: Request, res: Response, next: NextFunction) => {
  //   const { assessmentHurdleId } = req.params;
  //   if (!assessmentHurdleId) {
  //     return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   }
  //   try {
  //     const data = await this.exportSvc.getRecusedApplicantsFile(assessmentHurdleId);
  //     if (req.params.format && req.params.format === 'json') {
  //       res.status(200).json({ data: data, message: 'getRecusedFile' });
  //     } else {
  //       res.header('Content-Type', 'text/csv');
  //       const fileName = `Recused-${assessmentHurdleId}.csv`;
  //       res.attachment(fileName);
  //       write(data, {
  //         alwaysWriteHeaders: true,
  //         quote: true,
  //         writeHeaders: true,
  //         quoteColumns: true,
  //         quoteHeaders: false,
  //         headers: Object.keys(data[0]),
  //       }).pipe(res);
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // getFlaggedFile = async (req: Request, res: Response, next: NextFunction) => {
  //   const { assessmentHurdleId } = req.params;
  //   if (!assessmentHurdleId) {
  //     return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
  //   }
  //   try {
  //     const data = await this.exportSvc.getFlaggedApplicantsFile(assessmentHurdleId);
  //     if (req.params.format && req.params.format === 'json') {
  //       res.status(200).json({ data: data, message: 'getFlaggedFile' });
  //     } else {
  //       res.header('Content-Type', 'text/csv');
  //       const fileName = `Flagged-${assessmentHurdleId}.csv`;
  //       res.attachment(fileName);
  //       write(data, {
  //         alwaysWriteHeaders: true,
  //         quote: true,
  //         writeHeaders: true,
  //         quoteColumns: true,
  //         quoteHeaders: false,
  //         headers: Object.keys(data[0]),
  //       }).pipe(res);
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
