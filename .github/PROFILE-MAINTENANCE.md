# Profile maintenance

The README uses the updated professional summary supplied by Alessandro, translated into English, and preserves the Hollow Knight image. Skills and project descriptions were checked against the portfolio's public constants. Tailwind CSS, shadcn/ui, Motion, Bun and GitHub Actions are also used by the portfolio itself. Suggested study topics are not listed as existing skills.

The header follows the LinkedIn banner composition, with a terminal symbol on the left, Alessandro H. Ramos with H. Ramos in brand blue, and small decorative blue pixels on the right. The background uses subtle curved shapes without blur. The pixels are brand artwork, not contribution data. SVG files are self-contained and do not download fonts. The header and metric cards have light and dark variants selected with `<picture>`. The contact links are Portfolio, LinkedIn and Email. Activity counters and repository languages appear before the annual contribution chart; cards wrap on narrow screens. Both metric cards use a 320 × 165 content canvas with 8 units of outer padding. Contribution cards use 12 units. All cards share 20-unit corner radii, a subtle border and solid graphite #1c1c1c / white surfaces. There are no glass reflections or inset highlights. Non-breaking spaces between the two metric pictures provide a visible gap in GitHub Markdown.

## Activity cards

Run `node scripts/refresh-profile-cards.mjs` to refresh all SVG snapshots. Node.js 20 or later is required. No dependency installation or personal access token is needed.

Sources:

- [GitHub Stats Extended](https://github.com/stats-organization/github-readme-stats): commits, pull requests, merged pull requests and languages. The canonical public deployment is `github-stats-extended.vercel.app`.
- [GitHub Profile Summary Cards](https://github.com/vn7n24fzkq/github-profile-summary-cards): contribution overview and activity chart.

The script changes presentation colors and surface framing in the cards and retains the full contribution chart at all screen widths. Metrics, periods and chart data remain those reported by the providers. All providers must return valid SVG cards before any snapshots are replaced. If fetching fails, the workflow fails and the previously committed cards remain available in the README.

Publicly available counters do not necessarily cover all professional or private work. Language percentages describe repositories, not skill levels or time spent coding.

## Automatic updates

`.github/workflows/update-profile-cards.yml` refreshes the snapshots daily at 06:17 UTC (03:17 in Fortaleza), on manual dispatch, or when the script/workflow changes on `master`. It commits changes only when the snapshots differ. It uses the built-in repository token with job-scoped `contents: write`; no additional secret is required. Actual scheduled execution begins after the workflow is committed and pushed to GitHub. Repository rules can require additional setup for bot pushes.

The workflow has been prepared locally. Its live GitHub Actions execution must be checked after publishing; local verification does not prove a remote workflow run.

Skills use locally stored 28 px badges grouped by area, with a solid #23272e background, subtle border, 7 px corner radius and 12 px text. Shields.io supplies the source icons and label measurements; the refresh script applies the custom frame without gradients, shadows or text duplication. Labels without a matching icon retain a text-only badge. The same dark-neutral badges are used in both themes. Run `node scripts/refresh-skill-badges.mjs` to refresh the assets from the skills already listed in README.md; no install or secret is required. The source is https://shields.io/badges/static-badge. Metric images are displayed at 320 px each and the full contribution chart at 660 px maximum, shrinking with the available width.
