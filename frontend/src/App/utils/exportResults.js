import { getHiringActionResults } from "../../query/hiringActions";

const HEADERS = [
  "Vacancy ID",
  "Assessment ID",
  "Application ID",
  "Application Rating ID",
  "Applicant Last Name",
  "Applicant First Name",
  "Applicant Middle Name",
  "Application Number",
  "Rating Combination",
  "Assessment Rating",
  "Minimum Qualifications Rating",
  "\n"
];

// TODO: the backend should send this and this function should go away
function getHurdleNorCode(hurdleResult) {
  if (hurdleResult === true) {
    return "NOR_CODE_SUCCESS";
  }
  if (hurdleResult === false) {
    return "NOR_CODE_FAILURE";
  }
  return null;
}

export const exportResults = async hiringActionId => {
  const data = await getHiringActionResults(hiringActionId);
  let csv = "";

  csv += HEADERS.join(",");

  data.forEach(row => {
    const values = [
      row.staffing_vacancy_id,
      row.staffing_assessment_id,
      row.staffing_application_id,
      row.staffing_application_rating_id,
      row.staffing_last_name,
      row.staffing_first_name,
      row.staffing_middle_name,
      row.staffing_application_number,
      row.staffing_rating_combination,
      getHurdleNorCode(row.hurdle_result),
      row.staffing_minimum_qualifications_rating,
      "\n"
    ];
    csv += values.join(",");
  });
  var hiddenElement = document.createElement("a");
  document.getElementById("root").appendChild(hiddenElement); // supposedly, firefox expects the hidden element to be in the DOM.
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = "results.csv";
  hiddenElement.click();
};
