import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

/**
 *
 * 1 2 3 4 5 6 7 8 9 10
 * Detratores => 0 - 6
 * Passivos => 7 - 8
 * Promotores => 9 - 10
 *
 * (Número de promotores - Número de detratores) / (Número de respondentes) X 100
 */

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsres = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveysUsres.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passive = surveysUsres.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoter = surveysUsres.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveysUsres.length;

    const calculate = Number(
      (((promoter - detractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractor,
      promoter,
      passive,
      nps: calculate,
    });
  }
}

export { NpsController };
