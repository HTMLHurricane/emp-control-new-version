import { useCheckUserQuery } from '@/entities/auth/api';
import { useCreateBranchMutation } from '@/entities/branch/api';
import { IBranchPost } from '@/entities/branch/model/types';
import { TOKEN, useAppActions } from '@/shared';
import { FormLayout } from '@/shared/ui/formLayout/formLayout';
import { Button, Checkbox, Col, Form, Input, message, Row } from 'antd';
import { useEffect } from 'react';

const AdminCreateBranchForm = () => {
    const [form] = Form.useForm();
    const [createBranch, { isSuccess, isLoading, isError }] =
        useCreateBranchMutation();
    const { setIsCreatingBranch } = useAppActions();
    const token = TOKEN.get();
    const { data: getmeData } = useCheckUserQuery(token as string);
    const onSubmit = (data: Omit<IBranchPost, 'organization_id'>) => {
        createBranch({ organization_id: getmeData!.org, ...data });
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
        <FormLayout title="Создать филиал" size="xl">
            <Form
                form={form}
                onFinish={onSubmit}
                className="space-y-4"
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item<IBranchPost>
                            name="name"
                            label="Название филиала"
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, заполните поле!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item<IBranchPost>
                            name="address"
                            label="Адрес"
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, заполните поле!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={12} className="pt-8">
                        {' '}
                        <Form.Item name="is_active" valuePropName="checked">
                            <Checkbox>
                                <span className="ml-5">Активность</span>
                            </Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-end space-x-4">
                    <Button onClick={onCancel} type="default">
                        Отмена
                    </Button>
                    <Button
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                    >
                        Сохранить
                    </Button>
                </div>
            </Form>
        </FormLayout>
    );
};

export { AdminCreateBranchForm };
