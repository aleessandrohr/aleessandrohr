import { mkdir, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const username = process.env.PROFILE_USERNAME || "aleessandrohr";
const output = new URL("../assets/stats/", import.meta.url);
const themes = {
	dark: {
		background: "131313",
		surface: "1c1c1c",
		brand: "3b82f6",
		text: "adadad",
		border: "333333",
		summary: "github_dark",
	},
	light: {
		background: "f9f9f9",
		surface: "ffffff",
		brand: "0b61ea",
		text: "666666",
		border: "dedede",
		summary: "github",
	},
};

const cards = Object.entries(themes).flatMap(([theme, colors]) => {
	const common = {
		username,
		hide_border: "true",
		bg_color: colors.background,
		title_color: colors.brand,
		text_color: colors.text,
		icon_color: colors.brand,
		disable_animations: "true",
	};
	return [
		{
			name: `development-${theme}`,
			url: `https://github-stats-extended.vercel.app/api?${new URLSearchParams({ ...common, show_icons: "true", hide_rank: "true", hide: "stars,issues,contribs", show: "prs_merged", custom_title: "Development activity" })}`,
		},
		{
			name: `languages-${theme}`,
			url: `https://github-stats-extended.vercel.app/api/top-langs/?${new URLSearchParams({ ...common, layout: "compact", langs_count: "6", custom_title: "Languages across repositories" })}`,
		},
		{
			name: `contributions-${theme}`,
			url: `https://github-profile-summary-cards.vercel.app/api/cards/profile-details?${new URLSearchParams({ username, theme: colors.summary, name: "Contribution overview", animation: "none" })}`,
			colors,
		},
	];
});

const alignMetricCard = (svg) => {
	return svg
		.replace(/<svg\b[^>]*>/, (root) =>
			root
				.replace(/width="[^"]*"/, 'width="320"')
				.replace(/height="[^"]*"/, 'height="165"')
				.replace(/viewBox="[^"]*"/, 'viewBox="0 0 320 165"'),
		)
		.replace(/<rect\b[^>]*data-testid="card-bg"[^>]*\/>/, "");
};

const frameCard = (svg, name) => {
	const dark = name.endsWith("-dark");
	const colors = dark ? themes.dark : themes.light;
	const root = svg.match(/<svg\b[^>]*>/)[0];
	const width = Number(root.match(/\bwidth="(\d+)"/)[1]);
	const height = Number(root.match(/\bheight="(\d+)"/)[1]);
	const padding = name.startsWith("contributions") ? 12 : 8;
	const framedWidth = width + padding * 2;
	const framedHeight = height + padding * 2;
	const content = svg.replace(
		/<rect\b[^>]*x="1"[^>]*height="99%"[^>]*><\/rect>/,
		"",
	);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${framedWidth}" height="${framedHeight}" viewBox="0 0 ${framedWidth} ${framedHeight}" role="img">
<rect x=".5" y=".5" width="${framedWidth - 1}" height="${framedHeight - 1}" rx="20" fill="#${colors.surface}"/>
<rect x=".5" y=".5" width="${framedWidth - 1}" height="${framedHeight - 1}" rx="20" fill="none" stroke="#${colors.border}" stroke-opacity="${dark ? 0.8 : 0.9}"/>
<g transform="translate(${padding} ${padding})">${content}</g></svg>`;
};

const fetchCard = async (card) => {
	let failure;
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const response = await fetch(card.url, {
				signal: AbortSignal.timeout(30000),
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			let svg = await response.text();
			if (
				!/<svg\b/.test(svg) ||
				!svg.trimEnd().endsWith("</svg>") ||
				/Something went wrong|API rate limit exceeded|Invalid username|Could not fetch|mock data/i.test(
					svg,
				)
			) {
				throw new Error("The provider returned an invalid or error card");
			}
			if (card.colors) {
				const map = {
					"#0d1117": `#${card.colors.background}`,
					"#ffffff": `#${card.colors.background}`,
					"#fff": `#${card.colors.background}`,
					"#2e343b": `#${card.colors.border}`,
					"#e4e2e2": `#${card.colors.border}`,
					"#0366d6": `#${card.colors.brand}`,
					"#40c463": `#${card.colors.brand}`,
					"#77909c": `#${card.colors.text}`,
					"#8b949e": `#${card.colors.text}`,
					"#434d58": `#${card.colors.text}`,
					"#333333": `#${card.colors.text}`,
				};
				svg = svg.replace(
					/#[0-9a-f]{3,8}\b/gi,
					(color) => map[color.toLowerCase()] || color,
				);
			}
			if (!card.colors) svg = alignMetricCard(svg);
			return { name: card.name, svg };
		} catch (error) {
			failure = error;
			if (attempt < 2)
				await new Promise((resolve) =>
					setTimeout(resolve, 1000 * (attempt + 1)),
				);
		}
	}
	throw new Error(`${card.name}: ${failure.message}`);
};

// Validate the complete set before replacing any existing cards.
const results = await Promise.all(cards.map(fetchCard));
await mkdir(output, { recursive: true });
for (const { name, svg: source } of results) {
	const svg = frameCard(source, name);
	const file = new URL(`${name}.svg`, output);
	const temporary = new URL(`${name}.svg.tmp`, output);
	await writeFile(temporary, svg);
	await rename(temporary, file);
	console.log(`Updated ${fileURLToPath(file)}`);
}
