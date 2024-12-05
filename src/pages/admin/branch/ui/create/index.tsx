import { useCreateBranchMutation } from '@/entities/branch/api';
import { IBranchPost } from '@/entities/branch/model/types';
import { useGetOrganizationQuery } from '@/entities/organization/api';
import { FlexBox, useAppActions } from '@/shared';
import { Button, Checkbox, Form, Input, message, Select } from 'antd';
import { useEffect } from 'react';

const AdminCreateBranchForm = () => {
    const [form] = Form.useForm();
    const [createBranch, { isSuccess, isLoading, isError }] =
        useCreateBranchMutation();
    const { setIsCreatingBranch } = useAppActions();
    const { data } = useGetOrganizationQuery();

    const onSubmit = (data: IBranchPost) => {
        createBranch(data);
    };

    const onCancel = () => {
        setIsCreatingBranch(false);
        form.resetFields(['name', 'address', 'is_active', 'organization_id']);
    };

    useEffect(() => {
        if (isSuccess) {
            message.success('Филиал успешно создан');
            setIsCreatingBranch(false);
        }
        if (isError) {
            message.error('Произошла ошибка во время создания филиала');
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
            <Form.Item<IBranchPost>
                name="name"
                label="Название филиала"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<IBranchPost>
                name="address"
                label="Адрес"
                rules={[
                    { required: true, message: 'Пожалуйста, заполните поле!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="organization_id"
                label="Организация"
                rules={[{ required: true, message: 'Выберите организацию!' }]}
            >
                <Select placeholder="Выберите организацию">
                    {data?.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="is_active" valuePropName="checked">
                <Checkbox>
                    <span className="ml-5">Активность</span>
                </Checkbox>
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

export { AdminCreateBranchForm };
