import { notFound } from 'next/navigation'
import { initialDecks } from '@/lib/mock-data'
import { StudyRouteClient } from '@/components/app/study-route-client'

export default async function StudyRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!initialDecks.some((deck) => deck.id === id)) notFound()
  return <StudyRouteClient deckId={id} />
}
