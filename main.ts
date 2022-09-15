//  d3-cloud object
class WordData {
	text: string = '';
	size: number = 0;

  constructor(text: string, size: number) {
    this.text = text;
    this.size = size;
  }
}

function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate();
}

// Make word data
export function getWordData(title: string) {
  const words = getWords(title);
  const wordData: { [key: string]: number } = {};
  words.forEach(word => {
    const data = wordData[word];
    const size = !data ? 1 : data + 1;
    wordData[word] = size;
  });
  
  return Object.keys(wordData).map(key => ({ 'text': key, 'size': 10 + wordData[key] * 10 }));
}

// Get words from google forms
function getWords(title: string) {
  const form = FormApp.getActiveForm();
  const targetItem = getItemByTitle(title);
  if (!targetItem) {
    throw Error('Target item not found.');
  }
  
  const responses = form.getResponses();
  return Array.prototype.concat.apply([], responses.map(response => response.getItemResponses()))
    .filter(item => item.getItem().getTitle() === targetItem.getTitle())
    .map(item => item.getResponse());
}

// Get item from google forms by title
function getItemByTitle(title: string) {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  return items.find(item => item.getTitle() === title);
}

// Get item names from google forms
function getItemNames() {
  const form = FormApp.getActiveForm();
  return form.getItems().map(item => item.getTitle());
}
