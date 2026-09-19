import { AppShell } from '@/components/app/app-shell'
import { ProfileView } from '@/components/app/profile-view'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  return <AppShell><ProfileView username={username} /></AppShell>
}
