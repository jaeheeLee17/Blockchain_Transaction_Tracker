import { takeLatest } from "redux-saga/effects";
import createRequestSaga from "src/libs/createRequestSaga";
import * as SEARCH from "./actions";
import * as naverSearchAPI from "src/libs/createRequestSaga";

const getNaverQueryKeywordSaga = createRequestSaga(
  SEARCH.GET_NAVER_QUERY_KEYWORD,
  naverSearchAPI.getNaverQueryKeyword
);

export default function* rootSaga() {
  yield [
    yield takeLatest(SEARCH.GET_NAVER_QUERY_KEYWORD, getNaverQueryKeywordSaga),
  ];
}
