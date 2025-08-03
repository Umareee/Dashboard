"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/badge/Badge";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import ProductsStats from "@/components/products/ProductsStats";
import { useProducts } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import {
  PlusIcon,
  MoreDotIcon,
  PencilIcon,
  TrashBinIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  AngleLeftIcon,
} from "@/icons";

export default function ProductsPage() {
  const { products, removeProduct } = useProducts();
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"All" | "In Stock" | "Out of Stock">("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search and stock filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === "All" || product.stock === stockFilter;
    return matchesSearch && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleDropdownToggle = (productId: string) => {
    setActiveDropdown(activeDropdown === productId ? null : productId);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setDeleteConfirm(productId);
    setActiveDropdown(null);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const product = products.find(p => p.id === deleteConfirm);
      removeProduct(deleteConfirm);
      addToast("success", `Product "${product?.name}" has been deleted successfully!`);
      setDeleteConfirm(null);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Cleanup effect to restore body scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [stockFilter, searchTerm]);

  // Generate pagination numbers with smart truncation
  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <ProductsStats />

      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Products</h1>
          <h2 className="text-xl font-semibold text-black dark:text-white mt-1">Products List</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your store progress to boost your sales.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
          <Link
            href="/products/add"
            className="inline-flex items-center px-4 py-2 bg-brand-500 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header with Filter */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Stock Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock:</span>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  {["All", "In Stock", "Out of Stock"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStockFilter(filter as "All" | "In Stock" | "Out of Stock")}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        stockFilter === filter
                          ? "bg-brand-500 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">IMG</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${product.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="light"
                      color={product.stock === "In Stock" ? "success" : "error"}
                      size="sm"
                    >
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(product.id)}
                        className="dropdown-toggle p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <MoreDotIcon className="h-5 w-5" />
                      </button>
                      <Dropdown
                        isOpen={activeDropdown === product.id}
                        onClose={() => setActiveDropdown(null)}
                        className="w-40"
                      >
                        <DropdownItem onClick={() => console.log("Edit", product.id)}>
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDeleteProduct(product.id)}>
                          <TrashBinIcon className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || filteredProducts.length === 0}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <AngleLeftIcon className="h-4 w-4" />
              </button>
              
              {totalPages > 0 && getPaginationNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`dots-${index}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || filteredProducts.length === 0}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={cancelDelete}
        >
          {/* Modal */}
          <div 
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <TrashBinIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              Delete Product
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
