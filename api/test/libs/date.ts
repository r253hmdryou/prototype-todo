import {advanceTo, clear} from "jest-date-mock";

type DateLike = number | string | Date;
type ScopeFunction<T> = () => T | Promise<T>;

/**
 * Date をモック化
 * @param dateLike Dateが示す値
 * @param scopeFunction mockが有効な関数
 * @returns scopeFunctionの戻り値
 */
export default async function mockDate<T>(dateLike: DateLike, scopeFunction: ScopeFunction<T>): Promise<T> {
	advanceTo(dateLike);
	try {
		return await scopeFunction();
	} finally {
		clear();
	}
}
