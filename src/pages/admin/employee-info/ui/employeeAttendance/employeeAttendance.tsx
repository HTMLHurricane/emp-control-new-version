import { useGetDailyAttendanceByIdQuery } from '@/entities/employee-info/api';
import { IDailyAttendanceById } from '@/entities/employee-info/model';
import { TableProps, Table, Image } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const EmployeeAttendance = () => {
    const [employeeTablePage, setEmployeeTablePage] = useState(1);
    const [employeeTableLimit, setEmployeeTableLimit] = useState(10);
    const { id } = useParams();
    const { data, isLoading } = useGetDailyAttendanceByIdQuery(
        {
            employee_id: id,
            page: employeeTablePage,
            page_size: employeeTableLimit,
        },
        { skip: id === undefined },
    );

    const columns: TableProps<IDailyAttendanceById>['columns'] = [
        {
            title: 'День',
            dataIndex: 'created_at',
            render: (item) => <>{item.split('T')[0]}</>,
            className: 'w-[120px]',
        },
        {
            title: 'Пришёл(а)',
            dataIndex: 'time_in',
            render: (item) => <>{item.substring(0, 5)}</>,
            className: 'w-[120px]',
        },
        {
            title: 'Фото прихода',
            dataIndex: 'attendance_in',
            render: (_, res) => (
                <div className="flex flex-wrap gap-2">
                    <Image
                        src={res.attendance_in.url}
                        width={150}
                        height={100}
                    />
                </div>
            ),
            className: 'w-[100px]',
        },
        {
            title: 'Опоздал(а)',
            dataIndex: 'late',
            render: (item) => <>{item}</>,
        },
        {
            title: 'Ранний уход',
            dataIndex: 'early',
            render: (item) => <>{item}</>,
        },
        {
            title: 'Ушёл(а)',
            dataIndex: 'time_out',
            render: (item) => <>{item.substring(0, 5)}</>,
        },
        {
            title: 'Фото ухода',
            dataIndex: 'attendance_out',
            render: (_, res) => (
                <div className="flex flex-wrap gap-2">
                    <Image
                        src={res.attendance_out.url}
                        width={150}
                        height={100}
                    />
                </div>
            ),
            className: 'w-[100px]',
        },
    ];

    return (
        <Table
            loading={isLoading}
            scroll={{ x: true, y: 400 }}
            bordered
            columns={columns}
            dataSource={data?.content}
            pagination={{
                showSizeChanger: true,
                current: employeeTablePage,
                pageSize: employeeTableLimit,
                total: data?.total_pages,
                onChange: (page, limit) => {
                    setEmployeeTablePage(page);
                    setEmployeeTableLimit(limit);
                },
            }}
            rowKey={() => Math.random()}
        />
    );
};

export { EmployeeAttendance };