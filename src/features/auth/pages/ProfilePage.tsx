import { useEffect, useRef, useState } from 'react'
import type { FieldPath } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FormErrorMessage,
  SubmitButton,
} from '@/features/auth/components'
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile'
import {
  profileSchema,
  type ProfileFormValues,
} from '@/features/auth/schemas/profile.schema'
import { selectUser, useAuthStore } from '@/features/auth/store/authStore'
import { resolveAssetUrl } from '@/features/auth/utils/assetUrl'

const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  sales: 'Sales',
} as const

const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_AVATAR_SIZE = 5 * 1024 * 1024

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ProfilePage() {
  const user = useAuthStore(selectUser)
  const updateProfileMutation = useUpdateProfile()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '?'
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Profile'

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  })

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    })
  }, [user, reset])

  useEffect(() => {
    const fieldErrors = updateProfileMutation.error?.fieldErrors
    if (!fieldErrors?.length) return

    for (const { field, message } of fieldErrors) {
      setError(field as FieldPath<ProfileFormValues>, {
        type: 'server',
        message,
      })
    }
  }, [updateProfileMutation.error, setError])

  // Revoke the object URL once the preview changes or the page unmounts so we
  // never leak blob memory.
  useEffect(() => {
    if (!avatarPreview) return
    return () => URL.revokeObjectURL(avatarPreview)
  }, [avatarPreview])

  const currentAvatar = resolveAssetUrl(user?.avatar)
  const displayedAvatar = removeAvatar
    ? undefined
    : avatarFile && avatarPreview
      ? avatarPreview
      : currentAvatar

  const canRemoveAvatar = Boolean(user?.avatar) || Boolean(avatarFile)

  const clearAvatarSelection = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(false)
    setAvatarError(undefined)
  }

  const handleAvatarChange = (file?: File) => {
    setAvatarError(undefined)

    if (!file) return

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError('Only JPG, PNG, or WebP images are allowed')
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError('Image must be 5 MB or smaller')
      return
    }

    setRemoveAvatar(false)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleCancel = () => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    })
    clearAvatarSelection()
    updateProfileMutation.reset()
  }

  const onSubmit = handleSubmit((values) => {
    updateProfileMutation.mutate(
      {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
        },
        avatarFile: avatarFile ?? undefined,
        removeAvatar: removeAvatar && !avatarFile ? true : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully.')
          handleCancel()
        },
      }
    )
  })

  const hasChanges = isDirty || Boolean(avatarFile) || removeAvatar

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile picture and personal information.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 text-xl">
              {displayedAvatar ? (
                <AvatarImage src={displayedAvatar} alt={displayName} />
              ) : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col items-start gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera aria-hidden="true" />
                  {user?.avatar || avatarFile ? 'Change photo' : 'Upload photo'}
                </Button>
                {canRemoveAvatar ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (avatarFile) {
                        // Discard the pending upload and fall back to the
                        // currently saved avatar.
                        setAvatarFile(null)
                        setAvatarPreview(null)
                        setRemoveAvatar(false)
                      } else {
                        setRemoveAvatar((value) => !value)
                      }
                      setAvatarError(undefined)
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                    {avatarFile ? 'Clear selection' : removeAvatar ? 'Undo remove' : 'Remove'}
                  </Button>
                ) : null}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_AVATAR_TYPES.join(',')}
                  className="hidden"
                  onChange={(event) =>
                    handleAvatarChange(event.target.files?.[0] ?? undefined)
                  }
                />
              </div>
              <FormErrorMessage message={avatarError} />
              {removeAvatar ? (
                <p className="text-sm text-muted-foreground">
                  Your photo will be removed when you save.
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Update your name and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={
                    errors.firstName ? 'firstName-error' : undefined
                  }
                  {...register('firstName')}
                />
                <FormErrorMessage
                  message={errors.firstName?.message}
                  id="firstName-error"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  aria-invalid={errors.lastName ? true : undefined}
                  aria-describedby={
                    errors.lastName ? 'lastName-error' : undefined
                  }
                  {...register('lastName')}
                />
                <FormErrorMessage
                  message={errors.lastName?.message}
                  id="lastName-error"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">
                  Phone{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  {...register('phone')}
                />
                <FormErrorMessage
                  message={errors.phone?.message}
                  id="phone-error"
                />
              </div>
            </div>

            {updateProfileMutation.error?.message ? (
              <FormErrorMessage message={updateProfileMutation.error.message} />
            ) : null}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <SubmitButton
                isLoading={updateProfileMutation.isPending}
                loadingText="Saving…"
                disabled={!hasChanges}
              >
                Save changes
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
          <CardDescription>
            System-managed details. Contact an administrator to change these.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Email
              </dt>
              <dd className="min-w-0 break-words text-sm">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Role
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {user ? ROLE_LABELS[user.role] : '—'}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Status
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {user ? (user.isActive ? 'Active' : 'Inactive') : '—'}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Last login
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {formatDate(user?.lastLogin)}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Joined
              </dt>
              <dd className="min-w-0 break-words text-sm">
                {formatDate(user?.createdAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}