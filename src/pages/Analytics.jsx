import ResourceChart from '../components/ResourceChart'
import EmptyState from '../components/EmptyState'
import { useLibrary } from '../hooks/useLibrary'
import { countBy, weeklyAdded } from '../utils/stats'

export default function Analytics() {
  const { resources } = useLibrary()
  if (resources.length === 0) return <EmptyState title="Nothing to analyze yet." text="Charts appear once you save some resources." />
  return (
    <>
      <h1 className="text-xl font-bold">Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <ResourceChart title="Resources by category" kind="donut" data={countBy(resources, (r) => r.category)} />
        <ResourceChart title="Resources by type" kind="bar" data={countBy(resources, (r) => r.type)} />
        <ResourceChart title="Resources added per week" kind="line" data={weeklyAdded(resources)} />
        <ResourceChart title="Reading status" kind="donut" data={countBy(resources, (r) => r.status)} />
      </div>
    </>
  )
}
