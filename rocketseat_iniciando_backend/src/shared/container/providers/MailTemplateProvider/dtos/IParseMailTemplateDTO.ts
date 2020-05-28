type templateVariables = {
  [key: string]: string | number;
};

export default interface IParseMailTemplateDTO {
  file: string;
  variables: templateVariables;
}
