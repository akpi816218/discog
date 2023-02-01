# DisCog

...is a general-purpose Discord bot.

## Contributions

Commits and PRs must be comprehensive and clearly describe their purpose and summarize changes made. Below are some prefixes to tag commits and PRs with for organization. Prepend one or more of these prefixes to commits or PR, followed by a colon, space, and the title.

| Tag | Meaning         |
| --- | --------------- |
| BF  | Bugfix          |
| DC  | Deleted Command |
| DE  | Deleted Event   |
| NC  | New Command     |
| NE  | New Event       |
| OR  | Other           |
| PR  | PR Commit       |
| UC  | Updated Command |
| UE  | Updated Event   |

- Commits and PRs must include all dependency changes and edits to `package.json`.
- PRs must be merged via a squash commit.

### Pre-Commit Tasks

- Test all features if committing to `gitmaster` branch.
- Run `npm run sanity-check` to lint and compile code. Edit code if needed. Repeat until no errors are returned.
- Commit and push.
