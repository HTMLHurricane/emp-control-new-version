import { useGetAllBranchesQuery } from '@/entities/branch/api';
import {
    useCreateEmployeeMutation,
    useSetEmployeeImageMutation,
} from '@/entities/employee/api';
import { IEmployeePost } from '@/entities/employee/model/types';
import { useGetOrganizationQuery } from '@/entities/organization/api';
import { useGetAllRolesQuery } from '@/entities/role/api';
import { useGetAllSchedulesQuery } from '@/entities/schedule/api';
import { FlexBox, useAppActions } from '@/shared';
import { mapToOptions } from '@/shared/lib/mapToOptions';
import { Button, Form, Input, Select, Upload, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

const AdminCreateEmployeeForm = () => {
    const [form] = Form.useForm();
    const [createEmployee, { isSuccess, isError }] =
        useCreateEmployeeMutation();
    const { data: roles } = useGetAllRolesQuery();
    const { data: branches } = useGetAllBranchesQuery();
    const { data: schedules } = useGetAllSchedulesQuery();
    const { data: organizations } = useGetOrganizationQuery();
    const { setIsCreatingEmployee } = useAppActions();
    const [
        setImage,
        { isLoading: loading, isSuccess: success, isError: error },
    ] = useSetEmployeeImageMutation();

    const roleOptions = useMemo(() => mapToOptions(roles), [roles]);
    const branchOptions = useMemo(() => mapToOptions(branches), [branches]);
    const scheduleOptions = useMemo(() => mapToOptions(schedules), [schedules]);
    const organizationOptions = useMemo(
        () => mapToOptions(organizations),
        [organizations],
    );

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleUploadChange = (info: any) => {
        if (info.fileList.length > 0) {
            const selectedFile = info.fileList[0].originFileObj;
            setImageFile(selectedFile);
        }
    };

    const onSubmit = async (data: IEmployeePost) => {
        const employeeResponse = await createEmployee(data).unwrap();
        if (imageFile) {
            await setImage({
                id: employeeResponse.data.id,
                file: imageFile,
            });
        }
    };

    useEffect(() => {
        if (isSuccess && success) {
            message.success('Сотрудник успешно создан!');
            setIsCreatingEmployee(false);
        } else if (loading) {
            message.loading('Создаем сотрудника...');
        } else if (isError || error) {
            message.error('Произошла ошибка при создании сотрудника.');
        }
    }, [isSuccess, isError, success, loading, error]);

    const onCancel = () => {
        setIsCreatingEmployee(false);
        form.resetFields();
    };

    useEffect(() => () => onCancel(), []);

    return (
        <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={onSubmit}
            layout="vertical"
        >
            <Form.Item
                label="Выберите изображение"
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, выберите изображение!',
                    },
                ]}
            >
                <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                    onChange={handleUploadChange}
                >
                    <Button icon={<UploadOutlined />}>
                        Выбрать изображение
                    </Button>
                </Upload>
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="first_name"
                label="Имя"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="last_name"
                label="Фамилия"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="position_id"
                label="Должность"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Select disabled={!roleOptions?.length} options={roleOptions} />
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="organization_id"
                label="Организация"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Select
                    disabled={!organizationOptions?.length}
                    options={organizationOptions}
                />
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="branch_id"
                label="Филиал"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Select
                    disabled={!branchOptions?.length}
                    options={branchOptions}
                />
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="schedule_id"
                label="Рабочий график"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Select
                    disabled={!scheduleOptions?.length}
                    options={scheduleOptions}
                />
            </Form.Item>
            <Form.Item<IEmployeePost>
                name="phone"
                label="Телефон"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Input />
            </Form.Item>
            <FlexBox>
                <Button onClick={onCancel} type="default">
                    Отмена
                </Button>
                <Button loading={loading} type="primary" htmlType="submit">
                    Сохранить
                </Button>
            </FlexBox>
        </Form>
    );
};

export { AdminCreateEmployeeForm };
