import type { User, UserLoginEvent, UserSignupEvent, UserValidateEvent } from '@netlify/functions'

// Role that unlocks the private pages (see the role rules in _redirects).
const MEMBER_ROLE = 'member'

// Invited users get the member role; anyone else stays locked out.
function withMemberRole(user: User): { user: User } | undefined {
  const appMetadata = user.appMetadata ?? {}
  const roles = Array.isArray(appMetadata.roles) ? (appMetadata.roles as string[]) : []
  if (!user.invitedAt || roles.includes(MEMBER_ROLE)) return undefined
  return { user: { ...user, appMetadata: { ...appMetadata, roles: [...roles, MEMBER_ROLE] } } }
}

export default {
  // Self-service signups are always refused; access is invite-only.
  // Invites sent from the Netlify dashboard don't go through this check.
  userValidate(event: UserValidateEvent) {
    return event.deny()
  },
  userSignup(event: UserSignupEvent) {
    return withMemberRole(event.user)
  },
  // Covers invited users whose role is missing (e.g. invited before this function existed).
  userLogin(event: UserLoginEvent) {
    return withMemberRole(event.user)
  },
}
