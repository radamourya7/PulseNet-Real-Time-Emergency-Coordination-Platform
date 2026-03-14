import { Search, Filter, SortAsc, MapPin, Calendar } from 'lucide-react'

export default function AlertFilters({ filters, setFilters }) {
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="filters-toolbar card-sm mb-16">
            <div className="flex flex-wrap items-center gap-16">
                <div className="filter-search-input">
                    <Search size={14} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search IDs, names..."
                        value={filters.query || ''}
                        onChange={(e) => handleFilterChange('query', e.target.value)}
                    />
                </div>

                <div className="divider-v" />

                <div className="filter-group">
                    <span className="filter-label"><Filter size={12} /> Status</span>
                    <select
                        className="filter-select"
                        value={filters.status || 'all'}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">All Incidents</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label"><SortAsc size={12} /> Severity</span>
                    <select
                        className="filter-select"
                        value={filters.severity || 'all'}
                        onChange={(e) => handleFilterChange('severity', e.target.value)}
                    >
                        <option value="all">Any Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div className="filter-group hide-mobile">
                    <span className="filter-label"><MapPin size={12} /> Region</span>
                    <select
                        className="filter-select"
                        value={filters.region || 'all'}
                        onChange={(e) => handleFilterChange('region', e.target.value)}
                    >
                        <option value="all">Global</option>
                        <option value="north">Sector North</option>
                        <option value="south">Sector South</option>
                        <option value="east">Sector East</option>
                        <option value="west">Sector West</option>
                    </select>
                </div>

                <div className="filter-group ml-auto">
                    <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ status: 'all', severity: 'all', region: 'all', query: '' })}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}
