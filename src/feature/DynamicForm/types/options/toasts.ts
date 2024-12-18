export type toastMessages = ToastSuccess | ToastError;

type ToastSuccess = {
  type: 'success';
  title: string;
  description: string;
};

type ToastError = {
  type: 'error';
  title: string;
  description: string;
};
