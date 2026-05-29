import fs from 'fs';
import path from 'path';

const testFile = path.join(process.cwd(), 'apps', 'web', 'tests', 'browser', 'generate-case-steps.spec.ts');
const outFile = path.join(process.cwd(), 'apps', 'web', 'tests', 'browser', 'case-steps.json');

const content = fs.readFileSync(testFile, 'utf8');
const stepRegex = /pushStep\(steps,\s*'([^']+)'\)/g;
const steps = [];
let m;
while ((m = stepRegex.exec(content)) !== null) {
  steps.push(m[1]);
}

fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), steps }, null, 2));
console.log('Wrote', outFile);
