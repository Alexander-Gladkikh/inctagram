import React from 'react'

import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Toaster } from 'react-hot-toast'

import s from './index.module.scss'

import { PublicPost } from '@/entities/publicPost'
import { postsApi } from '@/shared/api'
import { useGetAllPublicPostsQuery } from '@/shared/api/services/posts/posts.api'
import { GetAllPublicPostsResponseType } from '@/shared/api/services/posts/posts.api.types'
import { getLayout } from '@/shared/layouts/mainLayout/MainLayout'
import { wrapper } from '@/shared/providers/storeProvider/model/store'
import { ServerSidePropsType } from '@/shared/types/commonTypes'
import { ContentWrapper } from '@/shared/ui'
import { RegisteredUsersTablo } from '@/shared/ui/registeredUsersTablo/ui/RegisteredUsersTablo'

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async context => {
    //fetch publicPosts
    store.dispatch(postsApi.endpoints?.getAllPublicPosts.initiate({ pageSize: '4' }))

    const data: Array<ServerSidePropsType<GetAllPublicPostsResponseType>> = await Promise.all(
      store.dispatch(postsApi.util?.getRunningQueriesThunk())
    )
      .then(res => {
        return res
      })
      .catch(error => {
        return error
      })

    return {
      props: {
        publicPostsData: data,
        ...(await serverSideTranslations(context.locale as string, 'common')),
      },
    }
  }
)
type HomeProps = {
  publicPostsData: Array<ServerSidePropsType<GetAllPublicPostsResponseType>>
}

function Home(props: HomeProps) {
  const publicPosts = props.publicPostsData[0].data

  return (
    <div className={s.home}>
      <Toaster position={'bottom-center'} />
      <ContentWrapper className={s.homeContentWrapper}>
        hey
        <RegisteredUsersTablo registeredUsers={publicPosts.totalUsers} />
        <div className={s.postsContainer}>
          {publicPosts.items.map(post => (
            <PublicPost key={post.id} {...post} />
          ))}
        </div>
      </ContentWrapper>
    </div>
  )
}

Home.getLayout = getLayout
export default Home
