import React, { useContext, useEffect, useReducer } from 'react';

import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions';
import reducer from './reducer';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?';

const initialState = {
  isLoading: true,
  hits: [],
  query: 'batman',
  page: 0,
  nbPages: 0,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  // fetch Stories function
  const fetchStories = async (url) => {
    dispatch({ type: SET_LOADING });
    try {
      const response = await fetch(url);
      const data = await response.json();
      dispatch({
        type: SET_STORIES,
        payload: { hits: data.hits, nbPages: data.nbPages },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // remove story function
  const removeStory = (id) => {
    dispatch({ type: REMOVE_STORY, payload: id });
  };

  // handle Search function
  const handleSearch = (query) => {
    dispatch({ type: HANDLE_SEARCH, payload: query });
  };

  // handle page function
  const handlePage = (value) => {
    dispatch({ type: HANDLE_PAGE, payload: value });
  };

  // useEffect
  useEffect(() => {
    fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
  }, [state.query, state.page]);

  // return
  return (
    <AppContext.Provider
      value={{ ...state, removeStory, handleSearch, handlePage }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
