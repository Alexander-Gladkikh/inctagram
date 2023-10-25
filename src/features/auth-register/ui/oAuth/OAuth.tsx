import React from 'react'

import { useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { toast } from 'react-hot-toast'

import styles from '@/features/auth-register/ui/oAuth/OAuth.module.scss'
import githubIcon from '@/shared/assets/icons/socialIcons/github-icon.svg'
import googleIcon from '@/shared/assets/icons/socialIcons/google-icon.svg'
import { API_AUTH_GITHUB_LOGIN_PATH, PROFILE_PATH } from '@/shared/constants/paths'

export const OAuth = () => {
  const { t: tError } = useTranslation('common', { keyPrefix: 'Error' })
  const router = useRouter()

  const loginGoogle = useGoogleLogin({
    onSuccess: () => router.push(PROFILE_PATH),
    onError: () => toast.error(tError('SomethingWentWrong')),
    flow: 'auth-code',
  })

  const onGithubLogin = (): void => {
    window.location.assign(API_AUTH_GITHUB_LOGIN_PATH)
  }

  return (
    <div className={styles.socialIconContainer}>
      <Image
        onClick={loginGoogle}
        className={styles.socialIcon}
        src={googleIcon}
        alt="google icon"
      />
      <Image
        onClick={onGithubLogin}
        className={styles.socialIcon}
        src={githubIcon}
        alt="github icon"
      />
    </div>
  )
}
