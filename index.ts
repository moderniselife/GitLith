import simpleGit from 'simple-git';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

// Initialize git instance
const git = simpleGit();

let keyHandlersEnabled = false;

// Create the Blessed screen
const screen = blessed.screen({
  smartCSR: true,
  title: 'GitLith',
  autoPadding: true,
  fullUnicode: true,
  handleUncaughtExceptions: true,
  ignoreLocked: ['C-c'],
  fastCSR: true
});

// Create a layout grid
const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen
});

// Create a file tree widget
const fileTree = grid.set(0, 0, 6, 6, contrib.tree, {
  label: 'File Tree',
  border: { type: 'line' },
  style: { 
    border: { fg: 'cyan' }, 
    fg: 'white', 
    bg: 'black'
  },
  template: {
    lines: true
  }
});

// Create a loading message box
const loadingBox = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: 3,
  content: 'Loading... Please wait',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'white'
    }
  }
});

// Create a list to display unstaged files
const unstagedList = grid.set(0, 6, 6, 6, blessed.list, {
  label: 'Unstaged Files',
  border: { type: 'line' },
  style: { 
    border: { fg: 'yellow' }, 
    fg: 'white', 
    bg: 'black',
    selected: {
      bg: 'yellow',
      fg: 'black'
    }
  },
  scrollable: true,
  alwaysFocus: true,
  keys: true,
  vi: true,
  scrollbar: {
    ch: '|',
    style: { fg: 'yellow' }
  }
});

// Create a list to display staged files
const stagedList = grid.set(6, 6, 6, 6, blessed.list, {
  label: 'Staged Files',
  border: { type: 'line' },
  style: { 
    border: { fg: 'green' }, 
    fg: 'white', 
    bg: 'black',
    selected: {
      bg: 'green',
      fg: 'black'
    }
  },
  scrollable: true,
  alwaysFocus: true,
  keys: true,
  vi: true,
  scrollbar: {
    ch: '|',
    style: { fg: 'green' }
  }
});

// Create buttons for Git operations
const buttons = grid.set(6, 0, 6, 6, blessed.box, {
  label: 'Git Commands',
  border: { type: 'line' },
  style: { border: { fg: 'magenta' }, fg: 'white', bg: 'black' },
  content: '[C] Commit\n[B] Create Branch\n[S] Switch Branch\n[P] Push\n[L] Pull\n[U] Stage/Unstage Selected\n[Tab] Switch Focus\n[Q] Quit',
  padding: 1
});

// Helper function to read directory recursively and build a tree structure
function buildTree(dirPath: string): any {
  const stats = fs.statSync(dirPath);
  if (stats.isDirectory()) {
    const children = fs.readdirSync(dirPath).map(child => buildTree(path.join(dirPath, child)));
    return { name: path.basename(dirPath), extended: true, children };
  }
  return { name: path.basename(dirPath) };
}

// Load file tree synchronously using `fs`
async function loadFileTree() {
  const spinner = ora('Loading file tree...').start();
  try {
    const rootDir = process.cwd(); // Get the current directory
    const treeData = buildTree(rootDir);

    fileTree.setData(treeData);
    spinner.succeed('File tree loaded');
    screen.render();
  } catch (error) {
    spinner.fail('Failed to load file tree');
    console.error('Error loading file tree:', error);
  }
}

// Refresh function to update file lists
async function refreshGitStatus() {
  const spinner = ora('Fetching Git status...').start();

  try {
    const status = await git.status();

    // Update unstaged files
    unstagedList.setItems(status.not_added.concat(status.modified));

    // Update staged files
    stagedList.setItems(status.staged);

    spinner.succeed('Git status fetched');
    screen.render();
  } catch (error) {
    spinner.fail('Failed to fetch Git status');
    console.error('Error fetching Git status:', error);
  }
}

// Commit function
async function commitChanges() {
  const spinner = ora('Committing changes...').start();

  try {
    await git.commit('CLI Commit');
    spinner.succeed('Changes committed');
    await refreshGitStatus();
  } catch (error) {
    spinner.fail('Commit failed');
    console.error('Error committing changes:', error);
  }
}

// Create branch function
async function createBranch(branchName: string) {
  const spinner = ora(`Creating branch ${branchName}...`).start();

  try {
    await git.checkoutLocalBranch(branchName);
    spinner.succeed(`Branch ${branchName} created`);
    screen.render();
  } catch (error) {
    spinner.fail('Branch creation failed');
    console.error('Error creating branch:', error);
  }
}

// Switch branch function
async function switchBranch(branchName: string) {
  const spinner = ora(`Switching to branch ${branchName}...`).start();

  try {
    await git.checkout(branchName);
    spinner.succeed(`Switched to branch ${branchName}`);
    screen.render();
  } catch (error) {
    spinner.fail('Branch switch failed');
    console.error('Error switching branch:', error);
  }
}

// Stage or unstage selected file
async function toggleStageFile(list: blessed.Widgets.ListElement, fileListType: 'unstaged' | 'staged') {
  const selectedFile = list.getItem(list.selected)?.content;

  if (!selectedFile) return;

  const spinner = ora(`${fileListType === 'unstaged' ? 'Staging' : 'Unstaging'} ${selectedFile}...`).start();

  try {
    if (fileListType === 'unstaged') {
      await git.add(selectedFile);
      spinner.succeed(`Staged ${selectedFile}`);
    } else {
      await git.reset(['--', selectedFile]);
      spinner.succeed(`Unstaged ${selectedFile}`);
    }
    await refreshGitStatus();
  } catch (error) {
    spinner.fail('Failed to stage/unstage file');
    console.error('Error staging/unstaging file:', error);
  }
}

// Handle input
function handleInput(str: string) {
  if (!keyHandlersEnabled) return;

  switch(str) {
    case 'q':
      process.exit(0);
      break;
    case '\t':
      if (unstagedList.focused) {
        stagedList.focus();
      } else {
        unstagedList.focus();
      }
      screen.render();
      break;
    case 'c':
      commitChanges();
      break;
    case 'b':
      const branchInput = blessed.prompt({
        parent: screen,
        border: 'line',
        height: 'shrink',
        width: '50%',
        top: 'center',
        left: 'center',
        label: ' Branch Name ',
        tags: true,
        keys: true
      });

      branchInput.readInput((err, value) => {
        if (value) createBranch(value);
      });
      break;
    case 's':
      const switchInput = blessed.prompt({
        parent: screen,
        border: 'line',
        height: 'shrink',
        width: '50%',
        top: 'center',
        left: 'center',
        label: ' Switch Branch ',
        tags: true,
        keys: true
      });

      switchInput.readInput((err, value) => {
        if (value) switchBranch(value);
      });
      break;
    case 'p':
      git.push();
      break;
    case 'l':
      git.pull();
      break;
    case 'u':
      if (unstagedList.focused) {
        toggleStageFile(unstagedList, 'unstaged');
      } else if (stagedList.focused) {
        toggleStageFile(stagedList, 'staged');
      }
      break;
    case 'j':
      if (unstagedList.focused) {
        unstagedList.down(1);
      } else if (stagedList.focused) {
        stagedList.down(1);
      }
      screen.render();
      break;
    case 'k':
      if (unstagedList.focused) {
        unstagedList.up(1);
      } else if (stagedList.focused) {
        stagedList.up(1);
      }
      screen.render();
      break;
  }
}

// Initial load of Git status and file tree
async function initialize() {
  try {
    // Show loading message
    loadingBox.setContent('Loading... Please wait 10 seconds before using keyboard');
    screen.render();
    
    // Load initial data
    await Promise.all([refreshGitStatus(), loadFileTree()]);
    
    // Set initial focus
    unstagedList.focus();
    
    // Initial render
    screen.render();

    // Set up input handling
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', handleInput);

    // Enable key handlers after delay
    setTimeout(() => {
      loadingBox.destroy();
      keyHandlersEnabled = true;
      screen.render();
    }, 10000);

  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

// Cleanup function
function cleanup() {
  screen.destroy();
  process.stdin.setRawMode(false);
  process.stdin.pause();
  process.exit(0);
}

// Handle exit
process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the application
(async () => {
  try {
    await initialize();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
})();
