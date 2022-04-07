export interface INotificationsResponse {
  code: number;
  data: {
    isSeen: number;
    next: {
      page: number;
      limit: number;
    };
    notifications: INotificationResponse;
  };
  message?: string;
  error?: string;
}

export interface INotificationResponse {
  attachedEls: { id: number };
  created: string;
  idNode: string;
  isSeen: boolean;
  isSend: boolean;
  label: { cmp_name: string };
  status: string;
  type: string;
  _id: string;
}
