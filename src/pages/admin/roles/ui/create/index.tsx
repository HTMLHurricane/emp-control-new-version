import { useGetOrganizationQuery } from '@/entities/organization/api';
import { useCreateRoleMutation } from '@/entities/role/api';
import { IRolePost } from '@/entities/role/model/types';
import { FlexBox, useAppActions } from '@/shared';
import { mapToOptions } from '@/shared/lib/mapToOptions';
import { Button, Form, Input, message, Select } from 'antd';
import { useEffect, useMemo } from 'react';

const AdminCreateRoleForm = () => {
    const [form] = Form.useForm();
    const [createRole, { isSuccess, isLoading, isError }] =
        useCreateRoleMutation();
    const { setIsCreatingRole } = useAppActions();
    const { data: organizations } = useGetOrganizationQuery();
    const organizationOptions = useMemo(
        () => mapToOptions(organizations),
        [organizations],
    );
    const onSubmit = (data: IRolePost) => {
        createRole(data);
    };

    const onCancel = () => {
        setIsCreatingRole(false);
        form.resetFields(['name']);
    };

    useEffect(() => {
        if (isSuccess) {
            message.success('Роль успешно создан');
            setIsCreatingRole(false);
        }
        if (isError) {
            message.error('Произошла ошибка во время создания роли');
            console.log('error', isError);
        }
    }, [isSuccess, isError]);

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
            <Form.Item<IRolePost>
                name="name"
                label="Название роли"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<IRolePost>
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

export { AdminCreateRoleForm };
