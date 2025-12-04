import { MeUserResponse } from '../_services/user.service';
import { apiFetch } from './apiFetch';

type UserResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  disabled: boolean;
};

type UserRequestResult<dataType> =
  | { success: true; data: dataType }
  | { success: false; status: number };

export async function getUsers(params?: {
  omitSelf?: boolean;
}): Promise<UserRequestResult<UserResponse[]>> {
  const res = await apiFetch(`/api/users`);

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const json: { data: UserResponse[] } = await res.json();

  let data = json.data;

  if (params?.omitSelf) {
    const me = await getMe();
    if (me.success) {
      data = data.filter((user) => user.id !== me.data.id);
    }
  }

  return {
    success: true,
    data: data.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    })),
  };
}

export async function getMe(): Promise<UserRequestResult<MeUserResponse>> {
  const res = await apiFetch(`/api/users/me`);
  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const data: MeUserResponse = await res.json();

  return { success: true, data };
}
