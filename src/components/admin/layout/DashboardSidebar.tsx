import React from 'react';
import { Building, Users, BookOpen, Calendar, LogOut, LayoutDashboard, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth';

interface DashboardSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentSection,
  onSectionChange,
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'buildings', label: 'Buildings', icon: Building },
    { id: 'floors', label: 'Floors', icon: Layers },
    { id: 'instructors', label: 'Instructors', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 bottom-0 top-16 overflow-y-auto">
      <nav className="px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentSection === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${
                currentSection === item.id ? 'text-blue-700' : 'text-gray-400'
              }`} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200 absolute bottom-8 left-4 right-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-400" />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
};