'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Edit } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
})

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const onSubmit = async (data) => {
    if (editingCategory) {
      // Update category
      console.log('Editing category:', editingCategory)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: data.name }),
        })

        if (!res.ok) throw new Error()

        const updated = await res.json()
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updated.id ? updated : cat))
        )
        toast.success('Category updated')
        reset()
        setEditingCategory(null)
      } catch {
        toast.error('Failed to update category')
      }
    } else {
      // Add category
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!res.ok) throw new Error()

        const newCategory = await res.json()
        setCategories([...categories, newCategory])
        toast.success('Category added')
        reset()
      } catch {
        toast.error('Failed to add category')
      }
    }
  }

  const onEdit = (category) => {
    setEditingCategory(category)
    setValue('name', category.name)
  }

  const onDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()

      setCategories((prev) => prev.filter((cat) => cat.id !== id))
      toast.success('Category deleted')
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="mx-auto min-h-screen p-8 bg-blue-200 rounded-2xl">
      <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-gray-500 p-4 rounded shadow-md"
      >
        <div>
          <label className="block font-medium mb-1 text-white">Category Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition flex items-center gap-2"
        >
          <Plus />
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-medium mb-2 text-center">Category List</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories yet.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded overflow-hidden text-left">
            <thead className="bg-blue-400">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className='bg-slate-300 text-gray-800'>
              {categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="px-4 py-2">{category.name}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => onEdit(category)} className="text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(category.id)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Toaster />
    </div>
  )
}
