import path from 'node:path';
import fs from 'node:fs/promises';

async function readJson(filePath) {
  try {
      const data = await fs.readFile(path.resolve(filePath), 'utf-8');
      return JSON.parse(data);
  } catch (error) {
      console.error(`Failed to read or parse the JSON file at ${filePath}:`, error.message);
      return null;
  }
}


async function readIndex() {
  const indexPath = './data/index.json';
  try {
    // Read the file synchronously
    const data = await fs.readFile(indexPath, 'utf8');

    // Parse the JSON content
    const parsedData = JSON.parse(data);

    if (!Array.isArray(parsedData)){
        console.error(`Index.json is not an array at ${indexPath}`);
        return [];
    }

    return parsedData;

  } catch (error) {
    console.error(`Failed to read or parse the index file at ${indexPath}:`, error.message);
    return [];
  }
}


async function readAll() {
    let parsedData = await readIndex();
    try {
         
        
        let jsonArray = [];

        for(let i = 0; i < parsedData.length; i++) {
            const file = parsedData[i];
            const filePath = `./data/${file.file}`;            
            const jsonFile = await readJson(filePath);
            jsonArray.push(jsonFile);
            
        }
         
        const cleanedArray = jsonArray.filter(item => item !== null);

        return cleanedArray;

        } catch (error) {
          console.error('Error reading or parsing the file:', error);
        }  
}

/* Skrifaðu þetta function sjálfur en lenti alltaf í veseni með að HTML og CSS spurningarnar voru þýddar sem kóði frekar en texti, chatGPT hjálpaði að laga*/

function createHtmlFiles(htmlFile) {

  const path = 'dist/' + htmlFile.title + '.html';
  
  let content = `<!DOCTYPE html>
      <html lang="is">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${htmlFile.title}</title>
          <link rel="stylesheet" href="../styles.css">
        </head>
        <body>
        <h1>${htmlFile.title}-spurningar</h1>
  `;
  
  for (let i = 0; i < htmlFile.questions.length; i++) {
    const question = htmlFile.questions[i];
    if (Array.isArray(question.answers)) {
      content += `
        <div class="question">
          <p>` + escapeHtml(question.question) + `</p>
          <form id="quizForm">
      `;

      for (let j = 0; j < question.answers.length; j++) {
        let answer = question.answers[j];
        let answerText = escapeHtml(String(answer.answer));

        if (answer.correct === true) {
          content += `
            <div class="answer"> 
              <label>` + answerText + `</label> 
              <input type="radio" name="` + htmlFile.title + i + `" value="true">
            </div>
          `;
        } else {
          content += `
            <div class="answer">
              <label>` + answerText + `</label>
              <input type="radio" name="` + htmlFile.title + i + `" value="false">
            </div>
          `;
        }
      }
      
      content += `
        <button type="button" class="svara-button" onclick="checkAnswer()">Svara</button>
      </form>
    </div>
      `;
    }
  }
  
  content += `
        </form>
        <p id="result"></p>
      </div>
      <script src="../script.js"></script>
      </body>
    </html>
  `;
  
  fs.writeFile(path, content, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the HTML file:', err);
    } else {
      console.log('HTML file created successfully!');
    }
  });
  
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


async function createIndex(indexJson) {
    let links = ``;
    let indexLinks = await readIndex();

    for(let i = 0; i < indexJson.length; i++) {
      let page = indexJson[i];
      if(typeof page.title === 'string' && Array.isArray(page.questions)) {
          createHtmlFiles(page);
          const linkFile = indexLinks.find(item => item.title === page.title); 
          let link = `<li><a href="` + linkFile.title + `.html">` + linkFile.title + `</a></li>`;
          links += link + '\n\t  ' 
      }
    }


    const indexPath = 'dist/index.html';
    const indexHTML = `
      <!DOCTYPE html>
      <html lang="is">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Spurningar um vefforritun</title>
          <link rel="stylesheet" href="../indexStylesheet.css">
        </head>
        <body>
          <h1>Spurningar um vefforritun</h1>
          <ul>
            ${links}
          </ul>
        </body>
      </html>
    `;

    fs.writeFile(indexPath, indexHTML, (err) => {
        if (err) {
          console.error('Error writing the HTML file:', err);
        } else {
          console.log('HTML file created successfully!');
        }
      });
}

/* ChatGPT gerði þetta function */

async function createDist(dirPath) {
  try {
    // Create the directory (will throw if it already exists)
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory "${dirPath}" created successfully.`);
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`);
  }
}

async function main(){
    await createDist('./dist')
    const jsonCollection = await readAll();
    createIndex(jsonCollection);
}

main();