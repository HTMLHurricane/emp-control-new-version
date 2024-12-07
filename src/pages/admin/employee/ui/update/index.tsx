import { useUpdateEmployeeMutation } from '@/entities/employee/api';
import { IEmployeePatch } from '@/entities/employee/model/types';
import { FlexBox, useAppActions, useAppSelector } from '@/shared';
import { Button, Form, Input, message, Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { useGetAllBranchesQuery } from '@/entities/branch/api';
import { useGetAllRolesQuery } from '@/entities/role/api';
import { useGetAllSchedulesQuery } from '@/entities/schedule/api';
import { mapToOptions } from '@/shared/lib/mapToOptions';

const AdminUpdateEmployeeForm = () => {
    const [form] = Form.useForm();
    const [updateEmployee, { isSuccess, isLoading, isError }] =
        useUpdateEmployeeMutation();
    const { data: schedules } = useGetAllSchedulesQuery();
    const { employeeForm } = useAppSelector();
    const { setIsUpdatingEmployee } = useAppActions();
    const { data: roles } = useGetAllRolesQuery();
    const { data: branches } = useGetAllBranchesQuery();

    const roleOptions = useMemo(() => mapToOptions(roles), [roles]);
    const branchOptions = useMemo(() => mapToOptions(branches), [branches]);
    const scheduleOptions = useMemo(() => mapToOptions(schedules), [schedules]);

    const onSubmit = (data: IEmployeePatch) => {
        updateEmployee({
            id: employeeForm?.id,
            ...data,
        });
    };

    const onCancel = () => {
        setIsUpdatingEmployee(false);
        form.resetFields();
    };

    useEffect(() => {
        if (employeeForm) {
            form.setFieldsValue({
                ...employeeForm,
                schedule: employeeForm.schedule_id,
            });
        }
    }, [employeeForm, form]);

    useEffect(() => {
        if (isSuccess) {
            message.success('Сотрудник успешно изменён');
            setIsUpdatingEmployee(false);
        }
        if (isError) {
            message.error('Произошла ошибка во время редактирования');
            console.log('error', isError);
        }
    }, [isSuccess, isError, setIsUpdatingEmployee]);

    useEffect(() => {
        return () => {
            onCancel();
        };
    }, []);

    return (
        <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={onSubmit}
            layout="vertical"
        >
            <Form.Item<IEmployeePatch> name="first_name" label="Имя">
                <Input />
            </Form.Item>
            <Form.Item<IEmployeePatch> name="last_name" label="Фамилия">
                <Input />
            </Form.Item>
            <Form.Item<IEmployeePatch> name="phone" label="Телефон">
                <Input />
                {/* <MaskedInput
          mask="+{998}00 000 00 00"
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.unmaskedValue)}
        /> */}
            </Form.Item>
            <Form.Item<IEmployeePatch> name="position_id" label="Должность">
                <Select disabled={!roles?.length} options={roleOptions} />
            </Form.Item>
            <Form.Item<IEmployeePatch> name="branch_id" label="Филиал">
                <Select disabled={!branches?.length} options={branchOptions} />
            </Form.Item>
            <Form.Item<IEmployeePatch>
                name="schedule_id"
                label="Рабочий график"
            >
                <Select
                    disabled={!schedules?.length}
                    options={scheduleOptions}
                />
            </Form.Item>

            <FlexBox>
                <Button onClick={onCancel} type="default">
                    Отмена
                </Button>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Сохранить
                </Button>
            </FlexBox>
        </Form>
    );
};

export { AdminUpdateEmployeeForm };
