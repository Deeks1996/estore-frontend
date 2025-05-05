'use client';

import { Dialog, DialogTitle } from '@headlessui/react';
import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

export default function ProductModal({ isOpen, onClose, product, onSave }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40">
        <Dialog.Panel className="bg-slate-200 p-6 rounded-md max-w-md w-full">
          <DialogTitle className="text-xl font-semibold mb-4">
            {product?.id ? 'Edit Product' : 'Add Product'}
          </DialogTitle>

          <ProductForm product={product || {}} onSubmit={onSave} />

          <div className="flex justify-center">
            <button
              onClick={onClose} // Close the modal when clicked
              className="mt-4 text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
