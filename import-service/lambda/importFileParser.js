import { setRespose } from '../utils.js'
export const importFileParser = event => {
	return setRespose(200, {message: event})
}