import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/$schoolId/invoices/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/_layout/$schoolId/invoices/"!</div>
}
