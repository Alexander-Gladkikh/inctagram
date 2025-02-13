import React, { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import s from './public-post.module.scss'

import { PostModal } from '@/entities/post-modal/post-modal'
import { PostResponseType, selectIsLoggedIn } from '@/shared/api'
import noImage from '@/shared/assets/icons/image/no-image.svg'
import { RoutersPath } from '@/shared/constants/paths'
import { useTruncateText } from '@/shared/hooks'
import { findDate } from '@/shared/utils/find-date'

export const PublicPost = (post: PostResponseType) => {
  const {
    images,
    owner: { lastName, firstName },
    avatarOwner,
    description,
    createdAt,
    ownerId,
    id,
  } = post

  const { t } = useTranslation('common', { keyPrefix: 'Post' })
  const [isPostActive, setIsPostActive] = useState(false)
  const postCreatedAt = findDate.difference(createdAt)
  const router = useRouter()

  const { displayShowMore, isShowMoreActive, setIsShowMoreActive, fullText } = useTruncateText(
    description,
    80
  )
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const togglePostModal = (id: number) => {
    if (!isLoggedIn) {
      router.push(`${RoutersPath.profile}/${ownerId}/?data=${id}`)
    } else {
      setIsPostActive(!isPostActive)
    }
  }

  const userName = `${firstName} ${lastName}` || t('AnonymousUser')

  return (
    <div className={s.post} key={id}>
      <div className={s.postLinkWrapper}>
        <Image
          src={images[0]?.url}
          width={234}
          height={240}
          alt="Picture of the post"
          onClick={() => togglePostModal(id)}
        />
        <div
          className={s.postContentWrapper}
          onClick={() => router.push(`${RoutersPath.profile}/${ownerId}`)}
        >
          <Image src={avatarOwner ?? noImage} width={36} height={36} alt={'Avatar picture'} />
          <h3 className={s.profileUrl}>{userName}</h3>
        </div>
      </div>
      <div>{postCreatedAt}</div>
      <p className={s.postDescription}>
        {fullText}{' '}
        {displayShowMore && (
          <span onClick={() => setIsShowMoreActive(!isShowMoreActive)} className={s.showMore}>
            {isShowMoreActive ? 'Hide' : 'Show more'}
          </span>
        )}
      </p>
      {isPostActive && <PostModal postData={post} togglePostModal={() => togglePostModal(id)} />}
    </div>
  )
}
