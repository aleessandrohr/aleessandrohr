import { createHash } from "node:crypto";
import {
	mkdir,
	readdir,
	readFile,
	rename,
	unlink,
	writeFile,
} from "node:fs/promises";

const readme = new URL("../README.md", import.meta.url);
const output = new URL("../assets/badges/", import.meta.url);
const markdown = await readFile(readme, "utf8");
const section = markdown.split("## Skills\n")[1]?.split("## Selected work")[0];
if (!section) throw new Error("Skills section not found");
const labels = [
	...section.matchAll(/`([^`]+)`|!\[([^\]]+)\]\(assets\/badges\//g),
].map((match) => match[1] || match[2]);
if (!labels.length) throw new Error("No skills found");

// Only use available brand icons. Skills without a matching icon retain their label.
const logos = {
	TypeScript: ["typescript", "3178C6"],
	JavaScript: ["javascript", "F7DF1E"],
	Python: ["python", "74A9D8"],
	"React.js": ["react", "61DAFB"],
	"Next.js": ["nextdotjs", "FFFFFF"],
	"Tailwind CSS": ["tailwindcss", "06B6D4"],
	"shadcn/ui": ["shadcnui", "FFFFFF"],
	"Node.js": ["nodedotjs", "5FA04E"],
	"Express.js": ["express", "FFFFFF"],
	Fastify: ["fastify", "FFFFFF"],
	"Prisma ORM": ["prisma", "FFFFFF"],
	"Drizzle ORM": ["drizzle", "C5F74F"],
	"React Native": ["react", "61DAFB"],
	Expo: ["expo", "FFFFFF"],
	PostgreSQL: ["postgresql", "74A9D8"],
	MongoDB: ["mongodb", "47A248"],
	Docker: ["docker", "2496ED"],
	Portainer: ["portainer", "13BEF9"],
	Cloudflare: ["cloudflare", "F38020"],
	Caddy: ["caddy", "1F88C0"],
	"Claude Code": ["claudecode", "D97757"],
	"Google AI Studio": ["google", "4285F4"],
	Git: ["git", "F05032"],
	Bun: ["bun", "FBF0DF"],
	"GitHub Actions": ["githubactions", "2088FF"],
	"Socket.io": ["socketdotio", "FFFFFF"],
};
const filename = (label) =>
	`${label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")}.svg`;

const refineBadge = (svg, label) => {
	const sourceWidth = Number(svg.match(/<svg[^>]*\bwidth="(\d+)"/)[1]);
	const sourceIcon = svg.match(/<image\b[^>]*\/>/)?.[0];
	const icon = sourceIcon
		? sourceIcon
				.replace(/\bx="[^"]*"/, 'x="10"')
				.replace(/\by="[^"]*"/, 'y="6"')
				.replace(/\bwidth="[^"]*"/, 'width="16"')
				.replace(/\bheight="[^"]*"/, 'height="16"')
		: "";
	const width = Math.ceil(
		((sourceWidth - (icon ? 28 : 10)) * 12) / 11 + (icon ? 44 : 20),
	);
	const escaped = label
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll('"', "&quot;");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="32" viewBox="0 0 ${width} 32" role="img" aria-label="${escaped}"><title>${escaped}</title><g transform="translate(0 4)"><rect x=".5" y=".5" width="${width - 1}" height="27" rx="7" fill="#23272e" stroke="#3b414b"/>${icon}<text x="${icon ? 34 : 10}" y="18" fill="#e6edf3" font-family="Verdana,DejaVu Sans,sans-serif" font-size="12">${escaped}</text></g></svg>`;
};

// Download in small batches; validate everything before replacing the last set.
const results = [];
for (let start = 0; start < labels.length; start += 4) {
	results.push(
		...(await Promise.all(
			labels.slice(start, start + 4).map(async (label) => {
				const options = new URLSearchParams({ style: "flat" });
				if (logos[label]) {
					options.set("logo", logos[label][0]);
					options.set("logoColor", logos[label][1]);
				}
				const message = encodeURIComponent(label.replaceAll("-", "--"));
				const response = await fetch(
					`https://img.shields.io/badge/${message}-27272a?${options}`,
					{ signal: AbortSignal.timeout(30000) },
				);
				if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
				const svg = await response.text();
				if (!svg.includes("<svg") || !svg.trimEnd().endsWith("</svg>"))
					throw new Error(`${label}: invalid SVG`);
				return { label, svg: refineBadge(svg, label) };
			}),
		)),
	);
}
const filenames = new Map(
	results.map(({ label, svg }) => [
		label,
		`${filename(label).slice(0, -4)}-${createHash("sha256").update(svg).digest("hex").slice(0, 12)}.svg`,
	]),
);
await mkdir(output, { recursive: true });
for (const { label, svg } of results) {
	const file = new URL(filenames.get(label), output);
	const temporary = new URL(`${filenames.get(label)}.tmp`, output);
	await writeFile(temporary, svg);
	await rename(temporary, file);
}
const updated = section.replace(
	/`([^`]+)`|!\[([^\]]+)\]\(assets\/badges\/[^)]+\)/g,
	(_, codeLabel, badgeLabel) => {
		const label = codeLabel || badgeLabel;
		return `![${label}](assets/badges/${filenames.get(label)})`;
	},
);
await writeFile(readme, markdown.replace(section, updated));
// This directory contains only generated skill badges. Remove obsolete versions
// after the README references the new, fully validated set.
const current = new Set(filenames.values());
for (const file of await readdir(output)) {
	if (file.endsWith(".svg") && !current.has(file))
		await unlink(new URL(file, output));
}
console.log(`Updated ${results.length} local skill badges.`);
