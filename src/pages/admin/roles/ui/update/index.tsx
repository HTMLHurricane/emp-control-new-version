import { useUpdateRoleMutation } from '@/entities/role/api';
import { IRolePatch } from '@/entities/role/model/types';
import { FlexBox, useAppActions, useAppSelector } from '@/shared';
import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';

const AdminUpdateRoleForm = () => {
    const [form] = Form.useForm();
    const [updateRole, { isSuccess, isLoading, isError }] =
        useUpdateRoleMutation();
    const { roleForm } = useAppSelector();
    const { setIsUpdatingRole } = useAppActions();

    const onSubmit = (data: IRolePatch) => {
        updateRole({ id: roleForm!.id, ...data });
    };

    const onCancel = () => {
        setIsUpdatingRole(false);
        form.resetFields(['name']);
    };

    useEffect(() => {
        if (roleForm) {
            form.setFieldsValue(roleForm);
        }
    }, [roleForm]);

    useEffect(() => {
        if (isSuccess) {
            message.success('Роль успешно изменён');
            setIsUpdatingRole(false);
        }
        if (isError) {
            message.error('Произошла ошибка во время редактирования');
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
            <Form.Item<IRolePatch>
                name="name"
                label="Название роли"
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
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Сохранить
                </Button>
            </FlexBox>
        </Form>
    );
};

export { AdminUpdateRoleForm };
