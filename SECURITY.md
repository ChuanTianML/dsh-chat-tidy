# Security policy

## Supported versions

Security fixes are provided for the latest released version.

## Reporting

Please report a suspected vulnerability privately through GitHub Security Advisories for `ChuanTianML/dsh-chat-tidy`. Do not include credentials, private session content, or proprietary repository data in a public issue.

## Data handling

Tidy Chat reads the current Harness session projection in the browser to identify turns, reasoning, tool categories, pending interactions, and the final answer. It sends nothing to a server and makes no network requests. It does not alter session logs, prompts, model output, credentials, or permissions.

Expansion choices are kept only in memory for the plugin lifetime. The plugin does not write localStorage, cookies, or other persistent browser storage. Disabling it restores original visibility and removes its controls, observers, timers, and styles.
