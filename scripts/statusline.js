const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'statusline.log');

function log(msg) {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`, 'utf8');
  } catch (e) {}
}

log('Statusline script triggered.');

// Read stdin
let input = '';
process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  log(`Raw input received: "${input}"`);
  let data = {};
  try {
    if (input.trim()) {
      data = JSON.parse(input);
    }
  } catch (e) {
    log(`JSON parsing failed: ${e.message}`);
  }

  const cwd = data.cwd || process.cwd();
  const folderName = path.basename(cwd);

  // Model name
  const modelName = (data.model && data.model.display_name) || 'Gemini';

  // Git branch
  let branch = '';
  try {
    const headPath = path.join(cwd, '.git', 'HEAD');
    if (fs.existsSync(headPath)) {
      const headContent = fs.readFileSync(headPath, 'utf8').trim();
      const match = headContent.match(/^ref:\s*refs\/heads\/(.+)$/);
      if (match) {
        branch = match[1];
      } else {
        branch = headContent.substring(0, 7); // Commit hash
      }
    }
  } catch (e) {
    log(`Git error: ${e.message}`);
  }

  // Format Statusline with high-fidelity ANSI colors
  const ANSI_BLUE = '\x1b[38;5;75m';
  const ANSI_GREEN = '\x1b[38;5;120m';
  const ANSI_CYAN = '\x1b[38;5;86m';
  const ANSI_RESET = '\x1b[0m';

  const folderPart = `${ANSI_BLUE}📁 ${folderName}${ANSI_RESET}`;
  const gitPart = branch ? ` | ${ANSI_GREEN}🌿 ${branch}${ANSI_RESET}` : '';
  const modelPart = ` | ${ANSI_CYAN}🤖 ${modelName}${ANSI_RESET}`;

  const output = `${folderPart}${gitPart}${modelPart}\n`;
  log(`Writing output: ${output.replace(/\x1b\[[0-9;]*m/g, '')}`); // Log without ANSI colors
  process.stdout.write(output);
});

