import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "quotation_request"
    | "quotations"
    | "announcement"
    | "callrequest"
    | "review"
    | "subscribers";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = ({ table, type, data, id }: FormContainerProps) => {
  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={{}}
    />
  );
};

export default FormContainer;
