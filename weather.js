#!/url/bin/env node
import { getArgs } from './helpers/args.js'
import { getIcon, getWeather } from './services/api.service.js'
import {
	printHelp,
	printSuccess,
	printError,
	printWeather,
} from './services/log.service.js'
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js'

const saveToken = async token => {
	if (!token.length) {
		printError('не переданый token')
		return
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.token, token)
		printSuccess('Токен сохранён')
	} catch (err) {
		printError(err.message)
	}
}

const saveCity = async city => {
	if (!city.length) {
		printError('не переданый город')
		return
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.city, city)
		printSuccess('Город сохранён')
	} catch (err) {
		printError(err.message)
	}
}

const getForcast = async () => {
	try {
		const city = process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city))
		const weather = await getWeather(city)
		printWeather(weather, getIcon(weather.weather[0].icon))
	} catch (err) {
		if (err?.response?.status == 404) {
			printError('Не выерно указан город')
		} else if (err?.response?.status == 401) {
			printError('Не выерно указан токен')
		} else {
			printError(e.message)
		}
	}
}

const initCLI = () => {
	// console.log('started')
	const args = getArgs(process.argv)
	if (args.h) {
		printHelp()
	}
	if (args.s) {
		return saveCity(args.s)
	}
	if (args.t) {
		return saveToken(args.t)
	}
	return getForcast()
}

initCLI()
