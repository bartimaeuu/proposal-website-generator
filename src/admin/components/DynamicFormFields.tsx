import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { UseFormRegister, UseFormGetValues, UseFormSetValue, Control, useWatch } from 'react-hook-form';
import { IconSelector } from './IconSelector';

const buttonClassName = "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50";
const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 text-base";
const textareaClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 text-base min-h-[80px]";

export const DynamicList: React.FC<{
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  placeholder?: string;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
}> = ({
  label,
  name,
  register,
  error,
  placeholder,
  getValues,
  setValue,
  control
}) => {
  const [useJson, setUseJson] = React.useState(false);
  const [items, setItems] = React.useState<string[]>([""]);
  
  // Watch for changes in the form value
  const watchedValue = useWatch({
    control,
    name,
    defaultValue: []
  });

  useEffect(() => {
    console.log(`DynamicList ${name} watched value:`, watchedValue);
    if (watchedValue) {
      const valueToUse = Array.isArray(watchedValue) ? watchedValue : [];
      setItems(valueToUse.length > 0 ? valueToUse : [""]);
    }
  }, [watchedValue, name]);

  const addItem = () => {
    const newItems = [...items, ""];
    setItems(newItems);
    setValue(name, newItems.filter(Boolean));
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [""]);
    setValue(name, newItems.filter(Boolean));
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    setValue(name, newItems.filter(Boolean));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const jsonValue = JSON.parse(e.target.value);
      const valueToUse = Array.isArray(jsonValue) ? jsonValue : [];
      setItems(valueToUse);
      setValue(name, valueToUse);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setUseJson(!useJson)}
          className={buttonClassName}
        >
          {useJson ? React.createElement(LucideIcons.List, { className: "h-4 w-4" }) : React.createElement(LucideIcons.Code, { className: "h-4 w-4" })}
          <span className="ml-2">{useJson ? 'Use List' : 'Use JSON'}</span>
        </button>
      </div>

      {useJson ? (
        <textarea
          value={JSON.stringify(items.filter(Boolean), null, 2)}
          onChange={handleJsonChange}
          className={textareaClassName}
          placeholder={placeholder}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className={inputClassName}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className={buttonClassName}
              >
                {React.createElement(LucideIcons.Minus, { className: "h-4 w-4" })}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className={buttonClassName}
          >
            {React.createElement(LucideIcons.Plus, { className: "h-4 w-4" })}
            <span className="ml-2">Add Item</span>
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const DynamicObjectList: React.FC<{
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  placeholder?: string;
  fields: { name: string; type: 'text' | 'textarea' | 'icon' }[];
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
}> = ({
  label,
  name,
  register,
  error,
  placeholder,
  fields,
  getValues,
  setValue,
  control
}) => {
  const [useJson, setUseJson] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([{}]);
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [currentEditingIcon, setCurrentEditingIcon] = useState<{ index: number; field: string } | null>(null);

  // Watch for changes in the form value
  const watchedValue = useWatch({
    control,
    name,
    defaultValue: []
  });

  useEffect(() => {
    if (watchedValue) {
      const valueToUse = Array.isArray(watchedValue) ? watchedValue : [];
      setItems(valueToUse.length > 0 ? valueToUse : [{}]);
    }
  }, [watchedValue, name]);

  const addItem = () => {
    const newItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
    const newItems = [...items, newItem];
    setItems(newItems);
    setValue(name, newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{}]);
    setValue(name, newItems);
  };

  const handleItemChange = (index: number, fieldName: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: value };
    setItems(newItems);
    setValue(name, newItems);
  };

  const handleIconSelect = (iconName: string) => {
    if (currentEditingIcon) {
      handleItemChange(currentEditingIcon.index, currentEditingIcon.field, iconName);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const jsonValue = JSON.parse(e.target.value);
      const valueToUse = Array.isArray(jsonValue) ? jsonValue : [];
      setItems(valueToUse);
      setValue(name, valueToUse);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  const renderIcon = (iconName: string) => {
    if (!iconName) return React.createElement(LucideIcons.Plus, { className: "h-5 w-5" });
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<any>;
    return Icon ? <Icon className="h-5 w-5" /> : <LucideIcons.Plus className="h-5 w-5" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setUseJson(!useJson)}
          className={buttonClassName}
        >
          {useJson ? React.createElement(LucideIcons.List, { className: "h-4 w-4" }) : React.createElement(LucideIcons.Code, { className: "h-4 w-4" })}
          <span className="ml-2">{useJson ? 'Use Form' : 'Use JSON'}</span>
        </button>
      </div>

      {useJson ? (
        <textarea
          value={JSON.stringify(items, null, 2)}
          onChange={handleJsonChange}
          className={textareaClassName}
          placeholder={placeholder}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className={buttonClassName}
                >
                  {React.createElement(LucideIcons.Minus, { className: "h-4 w-4" })}
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </label>
                    {field.type === 'icon' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item[field.name] || ''}
                          onChange={(e) => handleItemChange(index, field.name, e.target.value)}
                          className={inputClassName}
                          placeholder="Select an icon..."
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentEditingIcon({ index, field: field.name });
                            setIconSelectorOpen(true);
                          }}
                          className={buttonClassName}
                        >
                          {renderIcon(item[field.name])}
                        </button>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={item[field.name] || ''}
                        onChange={(e) => handleItemChange(index, field.name, e.target.value)}
                        className={textareaClassName}
                      />
                    ) : (
                      <input
                        type="text"
                        value={item[field.name] || ''}
                        onChange={(e) => handleItemChange(index, field.name, e.target.value)}
                        className={inputClassName}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className={buttonClassName}
          >
            {React.createElement(LucideIcons.Plus, { className: "h-4 w-4" })}
            <span className="ml-2">Add Item</span>
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <IconSelector
        isOpen={iconSelectorOpen}
        onClose={() => {
          setIconSelectorOpen(false);
          setCurrentEditingIcon(null);
        }}
        onSelect={handleIconSelect}
        currentIcon={currentEditingIcon ? items[currentEditingIcon.index]?.[currentEditingIcon.field] : undefined}
      />
    </div>
  );
};
