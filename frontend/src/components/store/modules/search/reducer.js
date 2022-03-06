import { handleActions } from "redux-actions";
import produce from "immer";
import * as SEARCH from "./actions";

// 저장소
const initialState = {
  searchKeyword: "",
  searchResult: [],
  errorMsg: "",
};

const search = handleActions(
  {
    [SEARCH.CHANGE_SEARCH_KEYWORD]: (state, action) => {
      console.log("CHANGE_SEARCH_KEYWORD => ", action.payload);
      return produce(state, (draft) => {
        draft.searchKeyword = action.payload;
        // CHANGE_SEARCH_KEYWORD를 불러오는데 거기에 들어오는 인자값들은 action.payload에 들어오게 됨 (예: 코로나) => draft의 searchKeyword에 입력을 해줌 => 상단의 initialSatate의 searchKeyword에 저장됨
      });
    },
    [SEARCH.GET_NAVER_QUERY_KEYWORD_SUCCESS]: (state, action) => {
      return produce(state, (draft) => {
        draft.searchResult = action.payload.items;
      });
    },
    [SEARCH.GET_NAVER_QUERY_KEYWORD_FAILED]: (state, action) => {
      return produce(state, (draft) => {
        draft.errorMsg = "호출 오류";
      });
    },
  },
  initialState
);

export default search;
