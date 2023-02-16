import React, { useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";


let API = "";

const initialState = {
    isLoading : true,
    query: "HTML",
    nbPages: 0,
    page: 0,
    hits: [],
}

const AppContext = React.createContext();

const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const fetchData = async (url) => {
        dispatch({type: "SET_LOADING"});
        try{
          const res = await fetch(url);
          const data = await res.json();
          dispatch({
            type:"GET_STORIES",
            payload: {
                hits: data.hits,
                nbPages: data.nbPages
            }
        })
          console.log(data);
          // isLoading = false;
        }catch(error){
          console.log(error);
        }
      }

      // to remove the post
      const removePost = (post_ID) => {
        dispatch({type: "REMOVE_POST", payload: post_ID})
      }

      const searchPost = (searchQuery) => {
        dispatch({
          type: "SEARCH_QUERY", 
          payload: searchQuery,
        })
      }

      const getNextPage = () => {
        dispatch({
          type: "NEXT_PAGE"
        })
      }

      const getPrevPage = () => {
        dispatch({
          type: "PREV_PAGE"
        })
      }
      
      useEffect(() => {
        fetchData(`${API}query=${state.query}&page=${state.page}`);
      }, [state.query, state.page]);
    return (
        <AppContext.Provider value={{ ...state, removePost, searchPost, getNextPage, getPrevPage }}>
            {children}
        </AppContext.Provider>
    )
}

// global context
const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext, AppProvider, useGlobalContext};