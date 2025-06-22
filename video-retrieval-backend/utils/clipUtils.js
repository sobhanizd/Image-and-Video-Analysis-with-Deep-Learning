/**
 * using the CLIP model for text to feature vector conversion was easier to implement in python
 * this class enables the use of the clip_operations.py
 */
const { spawn } = require('child_process');
const path = require('path');

async function encodeText(text) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../clip_operations.py');
        const process = spawn('python3', [scriptPath, 'encode', text]);

        let result = '';
        process.stdout.on('data', (data) => {
            result += data.toString();
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(`process exited with code ${code}`);
            } else {
                resolve(JSON.parse(result));
            }
        });
    });
}

module.exports = {
    encodeText
};
