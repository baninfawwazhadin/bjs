export class SuccessResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
