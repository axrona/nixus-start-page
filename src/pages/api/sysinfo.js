import fs from "fs"
import path from "path"

export default function handler(req, res) {
	try {
		const content = fs.readFileSync("/etc/os-release", "utf8")
		const nameMatch = content.match(/^NAME="?(.+?)"?$/m)

		const distroName = nameMatch ? nameMatch[1] : "Unknown"

		res.status(200).json({ distro: distroName })
	} catch (error) {
		res.status(500).json({ error: "Unable to read /etc/os-release" })
	}
}
