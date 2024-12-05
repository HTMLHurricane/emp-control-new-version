export interface IdName {
    id: number;
    name: string;
}

export interface IResponse {
    message: string;
    detail: string;
}

export interface IAttendanceStats {
    total_employees: number;
    present_employees: number;
    late_employees: number;
    absent_employees: number;
}

export interface IData<T> {
    data: T;
    success: boolean;
    total?: number;
}

export interface IdUrl {
    id: number;
    url: string;
}

