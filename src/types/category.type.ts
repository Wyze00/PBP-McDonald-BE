export interface PostCategoryRequest {
    name: string;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
}

export interface PutCategoryRequest extends PostCategoryRequest {}