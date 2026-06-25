import prisma from "@/lib/prisma";
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

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  // const { userId, sessionClaims } = auth();
  // const { userId, sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;
  // const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "quotation_request":
        // const studentGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        // const studentClasses = await prisma.renamedclass.findMany({
        //   include: { _count: { select: { student: true } } },
        // });
        // relatedData = { classes: studentClasses, grades: studentGrades };
        // break;

        // const examLessons = await prisma.lesson.findMany({
        //   where: {
        //     ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
        //   },
        //   select: { id: true, name: true },
        // });
        // relatedData = { lessons: examLessons };
        break;

      default:
        break;
    }
  }

  return (
    <>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </>
  );
};

export default FormContainer;
