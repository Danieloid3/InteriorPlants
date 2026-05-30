---
name: github-manager
description: Manage GitHub repository settings, specifically creating rulesets, and using the GitHub MCP for general repository management.
---

# GitHub Manager Skill

You have access to the `github-mcp-server` which provides tools to manage files, issues, PRs, branches, and searches on GitHub. When requested to interact with GitHub for standard operations (issues, pull requests, etc.), you should prioritize using these MCP tools.

However, when the user asks you to **create or manage rulesets, branch protections, or repository settings**, the MCP server does not currently have direct tools for these features.

In these specific scenarios, you MUST use the `run_command` tool to execute GitHub CLI (`gh api`) commands and interact directly with the GitHub REST API.

## Creating a Ruleset (Require Reviewers)

To create a ruleset (for example, to require 1 approving review before merging to `main`), run the following `gh api` command inside the repository directory. You may need to obtain the `{owner}` and `{repo}` from the git remote URL first (e.g. `git remote -v`).

```bash
# Example: Require 1 reviewer before merging to main, and block force pushes
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/{owner}/{repo}/rulesets \
  -f name="Require review before merge" \
  -f target="branch" \
  -f enforcement="active" \
  -f 'conditions[ref_name][include][]=refs/heads/main' \
  -f 'rules[][type]=pull_request' \
  -F 'rules[][parameters][required_approving_review_count]=1' \
  -f 'rules[][type]=non_fast_forward'
```

### Steps to Follow:

1. **Verify Authentication**: If `gh api` fails, ensure the user is authenticated via `gh auth status` or has a valid token.
2. **Find Repo Info**: Use `git remote -v` to get the `{owner}` and `{repo}` name if not explicitly provided.
3. **Draft the API Call**: Structure the `gh api` call matching the GitHub Ruleset REST API schema.
4. **Execute & Describe**: Run the command with `run_command` and inform the user of the success or error in natural language.
