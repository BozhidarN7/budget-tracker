When I start a task, I will include `[AGENTS.md: Active]` at the beginning of my response if I successfully read the AGENTS.md file, or `[AGENTS.md: Missing]` if the file doesn't exist or is empty. If AGENTS.md is missing, I will warn the user about potential issues and suggest initialization.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->
