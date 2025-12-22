import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Custom hook for handling table filters, pagination, and search with URL state management
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.itemsPerPage - Items per page (default: 20)
 * @param {number} options.debounceDelay - Debounce delay in milliseconds (default: 500)
 * @param {string} options.searchParam - URL parameter name for search (default: 'search')
 * @param {string} options.pageParam - URL parameter name for page (default: 'page')
 * @param {Object} options.additionalParams - Additional URL parameters to sync (default: {})
 * 
 * @returns {Object} - Table filter state and handlers
 * 
 * @example
 * const {
 *   searchFilter,
 *   currentPage,
 *   itemsPerPage,
 *   handleSearchChange,
 *   setCurrentPage,
 *   handleTabChange,
 *   additionalState
 * } = useTableFilters({ 
 *   itemsPerPage: 20,
 *   additionalParams: { transactionType: '', transactionStatus: '' }
 * });
 */
export const useTableFilters = (options = {}) => {
 const {
  itemsPerPage: defaultItemsPerPage = 20,
  debounceDelay = 500,
  searchParam = 'search',
  pageParam = 'page',
  additionalParams = {},
 } = options;

 const [searchParams, setSearchParams] = useSearchParams();
 const [searchFilter, setSearchFilter] = useState(
  searchParams.get(searchParam) || ''
 );
 const [currentPage, setCurrentPage] = useState(
  parseInt(searchParams.get(pageParam) || '0')
 );

 // Additional state for extra URL parameters
 const [additionalState, setAdditionalState] = useState(() => {
  const state = {};
  Object.keys(additionalParams).forEach(key => {
   state[key] = searchParams.get(key) || additionalParams[key];
  });
  return state;
 });

 // Debounced search function
 const debouncedSearch = useDebouncedCallback((value) => {
  setSearchFilter(value);
  setCurrentPage(0); // Reset to first page when searching
 }, debounceDelay);

 // Update URL params when search, page, or additional params change
 useEffect(() => {
  const newParams = new URLSearchParams();
  if (searchFilter) newParams.set(searchParam, searchFilter);
  if (currentPage > 0) newParams.set(pageParam, currentPage.toString());

  // Add additional params
  Object.keys(additionalState).forEach(key => {
   if (additionalState[key]) {
    newParams.set(key, additionalState[key]);
   }
  });

  setSearchParams(newParams, { replace: true });
 }, [searchFilter, currentPage, additionalState, setSearchParams, searchParam, pageParam]);

 // Initialize filters from URL params
 useEffect(() => {
  const urlSearch = searchParams.get(searchParam) || '';
  const urlPage = parseInt(searchParams.get(pageParam) || '0');

  setSearchFilter(urlSearch);
  setCurrentPage(urlPage);

  // Initialize additional params from URL
  const newAdditionalState = {};
  Object.keys(additionalParams).forEach(key => {
   newAdditionalState[key] = searchParams.get(key) || additionalParams[key];
  });
  setAdditionalState(newAdditionalState);
 }, [searchParams, searchParam, pageParam]); // Remove additionalParams from deps to avoid infinite loop

 const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchFilter(value);
  debouncedSearch(value);
 };

 const clearSearch = () => {
  setSearchFilter('');
  debouncedSearch('');
 };

 const handlePageChange = (page) => {
  setCurrentPage(page);
 };

 const handleTabChange = (tab) => {
  // Helper function for tab-based filtering
  // Usually combined with additional state management in component
  setCurrentPage(0);
 };

 const updateAdditionalState = (key, value) => {
  setAdditionalState(prev => ({ ...prev, [key]: value }));
 };

 return {
  searchFilter,
  currentPage,
  itemsPerPage: defaultItemsPerPage,
  additionalState,
  setCurrentPage: handlePageChange,
  handleSearchChange,
  clearSearch,
  handleTabChange,
  updateAdditionalState,
 };
};

