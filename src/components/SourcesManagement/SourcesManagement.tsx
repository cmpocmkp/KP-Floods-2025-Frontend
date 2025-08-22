import React, { useState, useEffect } from 'react';
import {
  Database, Plus, Search, Filter, MoreVertical, Edit, Trash2,
  Power, PowerOff, ExternalLink, Calendar, Hash, Users,
  TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock,
  Twitter, Facebook, Globe, BarChart3, RefreshCw
} from 'lucide-react';
import sourcesApi, { 
  Source, 
  SourcesStats, 
  SourcesFilters, 
  CreateSourceRequest, 
  UpdateSourceRequest 
} from '../../services/sourcesApi';

interface SourcesManagementProps {
  userRole?: string;
}

const SourcesManagement: React.FC<SourcesManagementProps> = ({ userRole = 'admin' }) => {
  // State management
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<SourcesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filters and pagination
  const [filters, setFilters] = useState<SourcesFilters>({
    page: 1,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState<CreateSourceRequest>({
    name: '',
    url_or_handle: '',
    type: 'news',
    description: '',
    status: 'active',
    visible: true,
    cm_media: false,
    metadata: {}
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load data on component mount and filter changes
  useEffect(() => {
    loadSources();
    loadStats();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.search]);

  const loadSources = async () => {
    try {
      const response = await sourcesApi.getSources(filters);
      setSources(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load sources');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await sourcesApi.getSourcesStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('❌ Error loading stats:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadSources(), loadStats()]);
  };

  const handleFilterChange = (key: keyof SourcesFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSort = (column: 'name' | 'type' | 'status' | 'fetch_count' | 'last_fetched' | 'created_at') => {
    const newOrder = filters.sort_by === column && filters.sort_order === 'ASC' ? 'DESC' : 'ASC';
    setFilters(prev => ({ ...prev, sort_by: column, sort_order: newOrder }));
  };

  const validateForm = (data: CreateSourceRequest | UpdateSourceRequest): boolean => {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!data.url_or_handle?.trim()) {
      errors.url_or_handle = 'URL/Handle is required';
    } else if (data.type && !sourcesApi.validateSourceUrl(data.url_or_handle, data.type)) {
      errors.url_or_handle = 'Invalid URL/Handle format for this source type';
    }

    if (!data.type) {
      errors.type = 'Source type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;

    setSubmitting(true);
    try {
      if (showEditModal && selectedSource) {
        await sourcesApi.updateSource(selectedSource.id, formData);
      } else {
        await sourcesApi.createSource(formData as CreateSourceRequest);
      }
      
      await loadSources();
      await loadStats();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save source');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (source: Source) => {
    setSelectedSource(source);
    setFormData({
      name: source.name,
      url_or_handle: source.url_or_handle,
      type: source.type,
      description: source.description || '',
      status: source.status,
      visible: source.visible,
      cm_media: source.cm_media,
      metadata: source.metadata
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!selectedSource) return;

    setSubmitting(true);
    try {
      await sourcesApi.deleteSource(selectedSource.id);
      await loadSources();
      await loadStats();
      setShowDeleteModal(false);
      setSelectedSource(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete source');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (source: Source, newStatus: 'active' | 'disabled' | 'error') => {
    try {
      await sourcesApi.updateSourceStatus(source.id, newStatus);
      await loadSources();
      await loadStats();
    } catch (err: any) {
      setError(err.message || 'Failed to update source status');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedSource(null);
    setFormData({
      name: '',
      url_or_handle: '',
      type: 'news',
      description: '',
      status: 'active',
      visible: true,
      cm_media: false,
      metadata: {}
    });
    setFormErrors({});
  };

  const getSourceTypeIcon = (type: 'x' | 'facebook' | 'news') => {
    switch (type) {
      case 'x':
        return <Twitter className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'news':
        return <Globe className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: 'active' | 'disabled' | 'error') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disabled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  // KPI Cards Component
  const KPICards = () => {
    if (!stats) return null;

    const cards = [
      {
        title: 'Total Sources',
        value: stats.total_sources,
        icon: <Database className="w-6 h-6 text-blue-500" />,
        change: null,
        color: 'bg-blue-50 border-blue-200'
      },
      {
        title: 'Active Sources',
        value: stats.active_sources,
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        change: `${Math.round((stats.active_sources / stats.total_sources) * 100)}%`,
        color: 'bg-green-50 border-green-200'
      },
      {
        title: 'Total Fetches',
        value: stats.total_fetches.toLocaleString(),
        icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
        change: null,
        color: 'bg-purple-50 border-purple-200'
      },
      {
        title: 'Error Sources',
        value: stats.error_sources,
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        change: stats.error_sources > 0 ? 'Needs attention' : 'All good',
        color: stats.error_sources > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
      },
      {
        title: 'CM Media Sources',
        value: stats.cm_media_sources,
        icon: <Users className="w-6 h-6 text-indigo-500" />,
        change: `${Math.round((stats.cm_media_sources / stats.total_sources) * 100)}%`,
        color: 'bg-indigo-50 border-indigo-200'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((card, index) => (
          <div key={index} className={`p-4 rounded-lg border ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.change && (
                  <p className="text-sm text-gray-500 mt-1">{card.change}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Source Type Distribution
  const SourceTypeDistribution = () => {
    if (!stats) return null;

    const types = [
      { name: 'News', count: stats.news_sources, color: 'bg-green-500' },
      { name: 'Twitter/X', count: stats.x_sources, color: 'bg-blue-500' },
      { name: 'Facebook', count: stats.facebook_sources, color: 'bg-indigo-500' }
    ];

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Source Distribution
        </h3>
        <div className="space-y-3">
          {types.map((type, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${type.color} mr-3`}></div>
                <span className="text-sm font-medium text-gray-700">{type.name}</span>
              </div>
              <span className="text-sm text-gray-900 font-semibold">{type.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Sources Management</h1>
              <p className="text-gray-600"> and monitor their status</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {(userRole === 'super_admin' || userRole === 'admin') && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Sources</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      setError(null);
                      handleRefresh();
                    }}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <KPICards />

        {/* Charts/Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <SourceTypeDistribution />
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {sources.slice(0, 5).map((source) => (
                <div key={source.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    {getSourceTypeIcon(source.type)}
                    <span className="ml-3 text-sm font-medium text-gray-900">{source.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">{sourcesApi.formatLastFetched(source.last_fetched)}</span>
                    {getStatusIcon(source.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              {/* Type Filter */}
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="news">News</option>
                <option value="x">Twitter/X</option>
                <option value="facebook">Facebook</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="error">Error</option>
              </select>

              {/* Visibility Filter */}
              <select
                value={filters.visible?.toString() || ''}
                onChange={(e) => handleFilterChange('visible', e.target.value ? e.target.value === 'true' : undefined)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Visibility</option>
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>

              {/* CM Media Filter */}
              <select
                value={filters.cm_media?.toString() || ''}
                onChange={(e) => handleFilterChange('cm_media', e.target.value ? e.target.value === 'true' : undefined)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Sources</option>
                <option value="true">CM Media</option>
                <option value="false">Regular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sources Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Source
                      {filters.sort_by === 'name' && (
                        <span className="ml-1">{filters.sort_order === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL/Handle
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {filters.sort_by === 'status' && (
                        <span className="ml-1">{filters.sort_order === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('fetch_count')}
                  >
                    <div className="flex items-center">
                      Fetches
                      {filters.sort_by === 'fetch_count' && (
                        <span className="ml-1">{filters.sort_order === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('last_fetched')}
                  >
                    <div className="flex items-center">
                      Last Fetched
                      {filters.sort_by === 'last_fetched' && (
                        <span className="ml-1">{filters.sort_order === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sources.map((source) => (
                  <tr key={source.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getSourceTypeIcon(source.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{source.name}</div>
                          {source.description && (
                            <div className="text-sm text-gray-500">{source.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourcesApi.getSourceTypeColor(source.type)}`}>
                        {source.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {sourcesApi.formatUrlForDisplay(source.url_or_handle, source.type)}
                      </div>
                      {source.type !== 'news' && (
                        <a
                          href={source.url_or_handle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center mt-1"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(source.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourcesApi.getSourceStatusColor(source.status)}`}>
                          {source.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-1 text-gray-400" />
                        {source.fetch_count.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {sourcesApi.formatLastFetched(source.last_fetched)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Status Toggle */}
                        {(userRole === 'super_admin' || userRole === 'admin') && (
                          <button
                            onClick={() => handleStatusToggle(
                              source, 
                              source.status === 'active' ? 'disabled' : 'active'
                            )}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              source.status === 'active' ? 'text-orange-600' : 'text-green-600'
                            }`}
                            title={source.status === 'active' ? 'Disable' : 'Enable'}
                          >
                            {source.status === 'active' ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Edit */}
                        {(userRole === 'super_admin' || userRole === 'admin') && (
                          <button
                            onClick={() => handleEdit(source)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        {(userRole === 'super_admin' || userRole === 'admin') && (
                          <button
                            onClick={() => {
                              setSelectedSource(source);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 rounded text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFilterChange('page', pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handleFilterChange('page', pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Source Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Edit Source' : 'Add New Source'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                {/* Source Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="news">News Website</option>
                    <option value="x">Twitter/X Account</option>
                    <option value="facebook">Facebook Page</option>
                  </select>
                  {formErrors.type && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Dawn News, PTI Official, BBC"
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* URL/Handle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'x' ? 'Twitter Handle' : 
                     formData.type === 'facebook' ? 'Facebook Page URL' : 'Website URL'} 
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.url_or_handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, url_or_handle: e.target.value }))}
                    className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.url_or_handle ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={
                      formData.type === 'x' ? '@username or https://twitter.com/username' :
                      formData.type === 'facebook' ? 'https://www.facebook.com/PageName' :
                      'https://example.com'
                    }
                    required
                  />
                  {formErrors.url_or_handle && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.url_or_handle}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of this source..."
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                {/* Visibility */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={formData.visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="visible" className="ml-2 block text-sm text-gray-700">
                    Visible in public analytics
                  </label>
                </div>

                {/* CM Media */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cm_media"
                    checked={formData.cm_media}
                    onChange={(e) => setFormData(prev => ({ ...prev, cm_media: e.target.checked }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cm_media" className="ml-2 block text-sm text-gray-700">
                    Chief Minister media source
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (showEditModal ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedSource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete <strong>{selectedSource.name}</strong>? 
                  This action cannot be undone and will remove all associated data.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {submitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourcesManagement; 