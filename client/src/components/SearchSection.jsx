"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // Import the router
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import debounce from 'lodash.debounce';
import { search, clearSearch } from '@/redux/reducers/searchReducer';

export default function ReduxSearch() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { searchInputResults, loading } = useSelector((state) => state.search);
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length > 2) {
        dispatch(search(query));
      } else {
        dispatch(clearSearch());
      }
    }, 400),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => debouncedSearch.cancel();
  }, [inputValue, debouncedSearch]);

  return (
    <Autocomplete
      freeSolo
      options={searchInputResults || []}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(e, value) => setInputValue(value)}

      onChange={(event, newValue) => {
        if (newValue) {
          const profileId = typeof newValue === 'string' ? newValue : newValue.user_id;
          router.push(`/search-result?q=${profileId}`);
        }
      }}

      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name || "")}
      
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          
          onKeyDown={(e) => {
            if (e.key === 'Enter') {

              if (inputValue.trim() !== "") {
                router.push(`/search-result?q=${encodeURIComponent(inputValue)}`);
              }
            }
          }}

          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {/* {loading ? <CircularProgress size={20} color="inherit" /> : null} */}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
