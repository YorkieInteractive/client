import { Loader, Button, SwitchField } from "@snailycad/ui";
import { FormField } from "components/form/FormField";
import { Modal } from "components/modal/Modal";
import { useModal } from "state/modalState";
import { Form, Formik, FormikHelpers } from "formik";
import useFetch from "lib/useFetch";
import { useBusinessState } from "state/business-state";
import { ModalIds } from "types/ModalIds";
import { useTranslations } from "use-intl";
import { UPDATE_EMPLOYEE_SCHEMA } from "@snailycad/schemas";
import { handleValidate } from "lib/handleValidate";
import { Select } from "components/form/Select";
import { FormRow } from "components/form/FormRow";
import { useValues } from "context/ValuesContext";
import { Employee, EmployeeAsEnum } from "@snailycad/types";
import type { PutBusinessEmployeesData } from "@snailycad/types/api";
import { shallow } from "zustand/shallow";

interface Props {
  isAdmin?: boolean;
  employee: Employee | null;
  onUpdate(old: Employee, newPost: Employee): void;
  onClose?(): void;
}

export function ManageEmployeeModal({ onClose, onUpdate, employee, isAdmin }: Props) {
  const { currentBusiness, currentEmployee } = useBusinessState(
    (state) => ({
      currentBusiness: state.currentBusiness,
      currentEmployee: state.currentEmployee,
    }),
    shallow,
  );

  const { isOpen, closeModal } = useModal();
  const { state, execute } = useFetch();
  const common = useTranslations("Common");
  const t = useTranslations("Business");

  const { businessRole } = useValues();
  const valueRoles = businessRole.values;
  const businessRoles = currentBusiness?.roles ?? [];
  const rolesToSelect = [...businessRoles, ...valueRoles];

  if (!isAdmin && (!currentBusiness || !currentEmployee)) {
    return null;
  }

  function handleClose() {
    closeModal(ModalIds.ManageEmployee);
    onClose?.();
  }

  async function onSubmit(
    values: typeof INITIAL_VALUES,
    helpers: FormikHelpers<typeof INITIAL_VALUES>,
  ) {
    if (!isAdmin && (!currentEmployee || !currentBusiness)) return;
    if (!employee) return;

    const businessId = isAdmin ? employee.businessId : currentBusiness?.id;
    const employeeId = isAdmin ? employee.id : currentEmployee?.id;

    const adminPath = `/admin/manage/businesses/employees/${employee.id}`;
    const regularPath = `/businesses/employees/${businessId}/${employee.id}`;
    const updatePath = isAdmin ? adminPath : regularPath;

    const { json } = await execute<PutBusinessEmployeesData, typeof INITIAL_VALUES>({
      path: updatePath,
      method: "PUT",
      data: { ...values, employeeId },
      helpers,
    });

    if (json.id) {
      closeModal(ModalIds.ManageEmployee);
      onUpdate(employee, { ...employee, ...json });
    }
  }

  const filteredRoles = isAdmin
    ? rolesToSelect
    : rolesToSelect.filter((v) => v.as !== EmployeeAsEnum.OWNER);

  const validate = handleValidate(UPDATE_EMPLOYEE_SCHEMA);
  const INITIAL_VALUES = {
    employeeId: employee?.id ?? "",
    canCreatePosts: employee?.canCreatePosts ?? true,
    employeeOfTheMonth: employee?.employeeOfTheMonth ?? false,
    canManageEmployees: employee?.canManageEmployees ?? false,
    canManageVehicles: employee?.canManageVehicles ?? false,
    roleId: employee?.roleId ?? null,
  };

  return (
    <Modal
      className="w-[600px]"
      title={t("manageEmployee")}
      isOpen={isOpen(ModalIds.ManageEmployee)}
      onClose={handleClose}
    >
      <Formik validate={validate} onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
        {({ handleChange, setFieldValue, errors, values, isValid }) => (
          <Form>
            <FormField errorMessage={errors.roleId} label={t("role")}>
              <Select
                name="roleId"
                onChange={handleChange}
                value={values.roleId}
                values={filteredRoles.map((v) => ({
                  label: v.value?.value,
                  value: v.id,
                }))}
              />
            </FormField>

            <FormRow>
              <SwitchField
                isSelected={values.canManageEmployees}
                onChange={(isSelected) => setFieldValue("canManageEmployees", isSelected)}
              >
                {t("canManageEmployees")}
              </SwitchField>

              <SwitchField
                isSelected={values.canManageVehicles}
                onChange={(isSelected) => setFieldValue("canManageVehicles", isSelected)}
              >
                {t("canManageVehicles")}
              </SwitchField>
            </FormRow>

            <FormRow>
              <SwitchField
                isSelected={values.canCreatePosts}
                onChange={(isSelected) => setFieldValue("canCreatePosts", isSelected)}
              >
                {t("canCreatePosts")}
              </SwitchField>

              <SwitchField
                isSelected={values.employeeOfTheMonth}
                onChange={(isSelected) => setFieldValue("employeeOfTheMonth", isSelected)}
              >
                {t("employeeOfTheMonth")}
              </SwitchField>
            </FormRow>

            <footer className="flex justify-end mt-5">
              <Button type="reset" onPress={handleClose} variant="cancel">
                {common("cancel")}
              </Button>
              <Button
                className="flex items-center"
                disabled={!isValid || state === "loading"}
                type="submit"
              >
                {state === "loading" ? <Loader className="mr-2" /> : null}
                {common("save")}
              </Button>
            </footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
