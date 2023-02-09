import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

type mailContact = {
  name: string;
  email: string;
};

export default interface ISendMailDTO {
  to: mailContact;
  from?: mailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
