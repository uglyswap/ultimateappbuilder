import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  FolderOpen,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Archive,
  MoreVertical,
  Trash2,
  Download,
  Eye,
} from 'lucide-react';
import { projectsApi } from '../services/api';
import type { Project, ProjectStatus } from '../types';

const statusColors: Record<ProjectStatus, { bg: string; text: string; icon: JSX.Element }> = {
  draft: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: <FolderOpen className="w-4 h-4" />,
  },
  generating: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  failed: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  archived: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    icon: <Archive className="w-4 h-4" />,
  },
};

export function ProjectsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects', statusFilter],
    queryFn: () =>
      projectsApi.list(
        statusFilter !== 'all' ? { status: statusFilter } : undefined
      ),
  });

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDownload = async (projectId: string) => {
    try {
      const blob = await projectsApi.download(projectId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your generated applications
              </p>
            </div>

            <Link
              to="/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              New Project
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[200px]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="generating">Generating</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description || 'No description'}
                      </p>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowDropdown(showDropdown === project.id ? null : project.id)
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {showDropdown === project.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                          <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {project.status === 'completed' && (
                            <button
                              onClick={() => handleDownload(project.id)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          )}
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Template Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
                    {project.template}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        statusColors[project.status].bg
                      } ${statusColors[project.status].text}`}
                    >
                      {statusColors[project.status].icon}
                      <span className="capitalize">{project.status}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    View Project
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FolderOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-8">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first project to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create Your First Project
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
