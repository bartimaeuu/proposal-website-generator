import React, { useState } from 'react';
import * as icons from 'lucide-react';
import { X } from 'lucide-react';

// Define our own categories
const ICON_CATEGORIES = {
  arrows: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp', 'ChevronDown'],
  actions: ['Plus', 'Minus', 'X', 'Check', 'Trash', 'Edit', 'Copy', 'Save'],
  media: ['Play', 'Pause', 'Stop', 'Volume', 'VolumeX', 'Volume1', 'Volume2'],
  navigation: ['Home', 'Menu', 'Search', 'Settings', 'User', 'Users', 'LogIn', 'LogOut'],
  files: ['File', 'FileText', 'Folder', 'FolderOpen', 'Download', 'Upload'],
  communication: ['MessageCircle', 'Mail', 'Phone', 'Send', 'AlertCircle', 'Bell'],
  shapes: ['Circle', 'Square', 'Triangle', 'Star', 'Heart', 'Hexagon'],
  devices: ['Smartphone', 'Tablet', 'Monitor', 'Printer', 'Camera', 'Headphones'],
};

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentIcon?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  onSelect,
  isOpen,
  onClose,
  currentIcon,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get all icons from the icons object
  const iconList = Object.entries(icons)
    .filter(([name]) => {
      return (
        name !== 'createLucideIcon' &&
        name !== 'default' &&
        !name.startsWith('__') &&
        name[0] === name[0].toUpperCase()
      );
    })
    .map(([name, component]) => ({
      name,
      component,
      displayName: name.replace(/([a-z])([A-Z])/g, '$1 $1').toLowerCase(),
      category: Object.entries(ICON_CATEGORIES).find(([_, icons]) => 
        icons.includes(name)
      )?.[0] || 'other'
    }));

  // Filter icons based on search term and category
  const filteredIcons = iconList.filter(({ displayName, name, category }) => {
    const matchesSearch = displayName.includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[85vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 text-lg border rounded-xl"
            />
          </div>
          <button 
            onClick={onClose}
            className="ml-6 p-3 hover:bg-gray-100 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 border-b">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Object.entries(ICON_CATEGORIES).map(([category, _]) => (
              <button
                key={category}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`px-6 py-2.5 text-sm rounded-full capitalize whitespace-nowrap ${
                  activeCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-auto p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {filteredIcons.length > 0 ? (
            filteredIcons.map(({ name, component: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  onSelect(name);
                  onClose();
                }}
                className={`p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-50 ${
                  currentIcon === name ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                }`}
              >
                <Icon className="h-8 w-8" />
                <span className="text-sm text-gray-600 text-center break-all">
                  {name}
                </span>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12 text-lg">
              No icons found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};