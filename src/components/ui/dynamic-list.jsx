
import { useState } from "react"
import { Trash2, Edit2 } from "lucide-react"

const DynamicList = ({ items = [], onChange, renderItem, addButtonText, emptyState }) => {
  const [editingIndex, setEditingIndex] = useState(null)

  const handleAdd = (item) => {
    onChange([...items, item])
  }

  const handleEdit = (index, item) => {
    const newItems = [...items]
    newItems[index] = item
    onChange(newItems)
    setEditingIndex(null)
  }

  const handleRemove = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex-1">
                {renderItem(item, index, editingIndex === index, (updatedItem) => handleEdit(index, updatedItem))}
              </div>

              {editingIndex !== index && (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(index)}
                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
            {emptyState || "No items added yet"}
          </div>
        )}
      </div>

      {renderItem(null, null, true, handleAdd)}
    </div>
  )
}

export default DynamicList
