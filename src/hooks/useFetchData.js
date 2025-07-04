import { useEffect, useState } from "react"
import moment from "moment"
import getConfig from "next/config"
import { useSettings } from "@/context/settings"
import { UAParser } from "ua-parser-js"

const useFetchData = () => {
	const { settings } = useSettings()
	const { publicRuntimeConfig } = getConfig()
	const version = publicRuntimeConfig?.version

	const [data, setData] = useState({
		version: "Unknown",
		theme: "Unknown",
		time: "Unknown",
		date: "Unknown",
		osName: "Unknown",
		osVersion: "Unknown",
		osReleaseName: "Unknown",
		browser: "Unknown",
		browserLower: "unknown",
		browserVersion: "0",
		engineName: "Unknown",
		engineVersion: "0"
	})

	useEffect(() => {
		const uap = new UAParser()
		const result = uap.getResult()

		const fillData = async () => {
			const os = await uap.getOS().withClientHints()

			let releaseName = "Unknown"

			try {
				const res = await fetch("/api/sysinfo")
				const json = await res.json()
				if (json?.distro) {
					releaseName = json.distro
				}
			} catch (err) {
				console.log(res)
			}

			setData({
				version: version,
				theme: settings.theme.name,
				time: moment().format(settings.fetch.timeFormat),
				date: moment().format(settings.fetch.dateFormat),
				osName: os?.name || "Unknown",
				osVersion: os?.version || "Unknown",
				osReleaseName: releaseName || "Unknown",
				browser: result.browser.name,
				browserLower: result.browser.name.toLowerCase(),
				browserVersion: result.browser.version,
				engineName: result.engine.name,
				engineVersion: result.engine.version
			})
		}

		fillData()
	}, [settings, version])

	return [data]
}

export default useFetchData
