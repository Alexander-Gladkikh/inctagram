import { useMutation } from '@apollo/client'
import { useSelector } from 'react-redux'

import { User } from '@/__generated__/graphql'
import { selectSelectedUser } from '@/features/super-admin-user-management/model/user-management-slice'
import {
  BAN_USER,
  GET_USERS_LIST,
} from '@/pages/super-admin/lib/graphql-query-constants/graphql-query-constanst'
import { getAdminBasicCredentials } from '@/pages/super-admin/lib/utils/utils'
import { useGetUserVariables } from '@/shared/hooks/use-get-user-variables'

export function useBanUserMutation() {
  const user = useSelector(selectSelectedUser)
  const { getUserVariables } = useGetUserVariables()
  const [banUser] = useMutation(BAN_USER, {
    update: cache => {
      const data = cache.readQuery({
        query: GET_USERS_LIST,
        variables: getUserVariables,
        optimistic: true,
      })
      const newData = {
        ...data,
        getUsers: {
          ...data?.getUsers,
          users:
            getUserVariables.statusFilter === 'UNBLOCKED'
              ? data?.getUsers?.users.filter(el => el.id !== user?.id)
              : data?.getUsers?.users.map(el =>
                  el.id === user?.id ? { ...el, userBan: { createdAt: Date(), reason: '' } } : el
                ),
        },
      }

      cache.writeQuery({
        query: GET_USERS_LIST,
        variables: getUserVariables,
        data: newData,
      })
    },
    optimisticResponse: () => {
      return { userId: user?.id, banUser: true }
    },
    onQueryUpdated: observableQuery => {
      void observableQuery.refetch()
    },
  })

  return (banReason: string, user: User | null) => {
    void banUser({
      variables: {
        banReason,
        userId: user?.id || 0,
      },
      context: {
        headers: {
          Authorization: `Basic ${getAdminBasicCredentials()}`,
        },
      },
    })
  }
}
