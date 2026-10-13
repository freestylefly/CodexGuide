export type NavbarDocItem = {
  file: string;
  icon: string;
};

export const startItemsSource: NavbarDocItem[] = [
  { file: "start/00-index.md", icon: "map" },
  { file: "start/01-what-is-codex.md", icon: "layout" },
  { file: "start/02-app-installation.md", icon: "desktop" },
  { file: "start/03-account-plan.md", icon: "star" },
  { file: "start/04-third-party-api.md", icon: "link" },
  { file: "start/05-app-overview.md", icon: "layout" },
  { file: "start/06-first-task.md", icon: "code" },
  { file: "start/07-task-design.md", icon: "edit" },
  { file: "start/08-task-execution.md", icon: "list" },
  { file: "start/09-mobile-control.md", icon: "mobile" },
  { file: "start/10-cli-installation.md", icon: "download" },
  { file: "start/11-cli-first-run.md", icon: "edit" },
  { file: "start/12-cli-options.md", icon: "terminal" },
  { file: "start/13-ide-vscode.md", icon: "code" },
  { file: "start/14-cloud.md", icon: "cloud" },
];

export const advancedItemsSource: NavbarDocItem[] = [
  { file: "advanced/00-index.md", icon: "map" },
  { file: "advanced/01-cost-context.md", icon: "coins" },
  { file: "advanced/02-agents-md.md", icon: "file" },
  { file: "advanced/03-skills-plugins-mcp.md", icon: "plugin" },
  { file: "advanced/04-permissions-security.md", icon: "safe" },
  { file: "advanced/05-automation.md", icon: "time" },
  { file: "advanced/06-hooks.md", icon: "tool" },
  { file: "advanced/07-sandbox-approvals.md", icon: "lock" },
  { file: "advanced/08-thread-management.md", icon: "branch" },
  { file: "advanced/09-config-toml.md", icon: "config" },
  { file: "advanced/10-team-playbook.md", icon: "people" },
  { file: "advanced/11-troubleshooting.md", icon: "debug" },
];

export const recipeItemsSource: NavbarDocItem[] = [
  { file: "recipes/00-index.md", icon: "layout" },
  { file: "recipes/01-ppt-skill-walkthrough.md", icon: "slides" },
  { file: "recipes/02-drawio-mcp.md", icon: "diagram" },
  { file: "recipes/03-playwright-mcp.md", icon: "chrome" },
  { file: "recipes/04-hyperframes-animation.md", icon: "video" },
  { file: "recipes/05-obsidian-codex.md", icon: "edit" },
  { file: "recipes/06-feishu-cli-codex.md", icon: "message" },
  { file: "recipes/07-llm-wiki-codex.md", icon: "note" },
  { file: "recipes/08-figma-mcp-codex.md", icon: "palette" },
  { file: "recipes/09-notion-mcp-codex.md", icon: "note" },
  { file: "recipes/10-dkfile-deploy-codex.md", icon: "launch" },
  { file: "recipes/11-remote-bug-fix.md", icon: "server" },
  { file: "recipes/12-chrome-browser-plugin.md", icon: "chrome" },
  { file: "recipes/13-github-actions-ci-fix.md", icon: "actions" },
  { file: "recipes/14-clinical-literature-review.md", icon: "table" },
  { file: "recipes/15-hatch-pet-photo.md", icon: "image" },
  { file: "recipes/16-android-remote-control.md", icon: "mobile" },
  { file: "recipes/17-desktop-pet.md", icon: "cat" },
  { file: "recipes/18-codex-profiles.md", icon: "terminal" },
];

export const manualItemsSource: NavbarDocItem[] = [
  { file: "manual/00-index.md", icon: "map" },
  { file: "manual/01-codex-updates.md", icon: "time" },
  { file: "manual/02-credits.md", icon: "heart" },
];
