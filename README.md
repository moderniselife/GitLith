# GitLith - Powering Your Git Workflow in the Terminal

![GitLith Logo](https://your-logo-url.com) <!-- Replace with an actual logo URL -->

## 🚀 Seamless Git Management. Streamlined DevOps. One Terminal.

GitLith is a powerful, intuitive **Git UI for the terminal**, designed to integrate seamlessly with **GitHub, Bitbucket, GitLab, and Jira**. View repositories, manage pull requests, track CI/CD pipelines, and stay on top of issues—all without leaving your terminal.

## ⚡ Features

- **📂 Unified Git Dashboard** – View repositories, branches, commits, and insights in a single interface.
- **🔍 PR & Issue Tracking** – Seamlessly manage pull requests and Jira issues from your terminal.
- **🚀 CI/CD Monitoring** – Track Bitbucket Pipelines, GitHub Actions, and other DevOps workflows in real time.
- **💻 Fast & Responsive Terminal UI** – Keyboard-driven, efficient, and distraction-free.
- **🔧 Cross-Platform & Customizable** – Works on macOS, Linux, and Windows.
- **📡 API Integrations** – Direct connections to GitHub, GitLab, Bitbucket, and Jira for real-time updates.

---

## 📥 Installation (Soon - manual GUI use for now)

### Using Bun (Recommended)
```sh
bun install -g gitlith
```

### Using npm
```sh
npm install -g gitlith
```

### Using Homebrew (macOS/Linux)
```sh
brew install lithium-labs/gitlith/gitlith
```

---

## 🚀 Getting Started

After installation, simply run:
```sh
gitlith
```

or use specific commands:
```sh
gitlith status   # View repository status

gitlith pr list  # Show open pull requests

gitlith ci watch # Monitor CI/CD pipelines

gitlith issue    # List Jira issues linked to your repo
```

### 🔧 Configuration
To connect to your GitHub, Bitbucket, GitLab, and Jira accounts, run:
```sh
gitlith config
```
Follow the prompts to set up authentication via API keys or OAuth.

---

## 🛠 Commands Overview

| Command            | Description |
|--------------------|-------------|
| `gitlith status`  | View repository status and recent activity |
| `gitlith pr list` | List open pull requests across linked platforms |
| `gitlith pr view <id>` | View details of a specific pull request |
| `gitlith ci watch` | Monitor running pipelines and workflows |
| `gitlith issue list` | View assigned Jira issues |
| `gitlith issue view <id>` | Show details of a specific issue |
| `gitlith config`  | Set up API integrations |

---

## 🌎 Supported Platforms

| Platform  | Features |
|-----------|----------|
| **GitHub**  | PRs, Issues, Actions, Commits |
| **Bitbucket**  | PRs, Pipelines, Issues, Commits |
| **GitLab**  | PRs, CI/CD Pipelines, Issues, Commits |
| **Jira**  | Issue tracking, Sprint management |

---

## 🔥 Why GitLith?
🚀 **No more context switching** – Get all your Git and project management data in one place.  
⚡ **Blazing fast terminal UI** – Keyboard-driven, distraction-free experience.  
🔗 **Tightly integrated with Git & DevOps tools** – PRs, Issues, Pipelines, and more.  
🛠 **Customizable** – Configure themes, shortcuts, and integrations to match your workflow.  

---

## 🏗 Roadmap
- [ ] Support for Azure DevOps
- [ ] Custom webhook integrations
- [ ] Enhanced Jira sprint tracking
- [ ] Terminal-based code review UI

---

## 🤝 Contributing
We welcome contributions! Fork the repo, make changes, and submit a pull request.
```sh
git clone https://github.com/lithium-labs-australia/gitlith.git
cd gitlith
bun install  # Install dependencies
```

### Run locally
```sh
bun run dev
```

### Submit a PR
1. Create a new branch: `git checkout -b feature-branch`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push to GitHub: `git push origin feature-branch`
4. Open a pull request

---

## 📄 License
GitLith is licensed under the **MIT License**.

---

## 📞 Support & Contact
For issues and feature requests, visit our [GitHub Issues](https://github.com/lithium-labs-australia/gitlith/issues).

📧 Email: support@lithiumlabs.org  
🌐 Website: [lithiumlabs.org](https://lithiumlabs.org)

---

🚀 *Git power, DevOps agility. Welcome to GitLith.*
