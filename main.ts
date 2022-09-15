function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createTemplateFromFile("index").evaluate();
}

// Make word data
function getWordData(title: string): { [key: string]: number | string }[] {
  const words = getWords(title) as string[];
  const wordData: { [key: string]: number } = {};
  words.forEach((word: string) => {
    const data = wordData[word];
    const size = !data ? 1 : data + 1;
    wordData[word] = size;
  });
  
  return Object.keys(wordData).map(key => ({ 'text': key, 'size': 10 + wordData[key] * 10 }));
}

// Get words from google forms
function getWords(title: string): any {
  const form = FormApp.getActiveForm();
  const targetItem = getItemByTitle(title);
  if (!targetItem) {
    throw Error('Target item not found.');
  }
  
  const responses = form.getResponses();
  return Array.prototype.concat.apply([], responses
    .map((response: GoogleAppsScript.Forms.FormResponse) => response.getItemResponses()))
    .filter((item: GoogleAppsScript.Forms.ItemResponse) => !Array.isArray(item.getResponse()))
    .filter((item: GoogleAppsScript.Forms.ItemResponse) => item.getItem().getTitle() === targetItem.getTitle())
    .map((item: GoogleAppsScript.Forms.ItemResponse) => item.getResponse());
}

// Get item from google forms by title
function getItemByTitle(title: string): GoogleAppsScript.Forms.Item | undefined {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  return items.find(item => item.getTitle() === title);
}

// Get item names from google forms
function getItemNames(): string[] {
  const form = FormApp.getActiveForm();
  return form.getItems().map(item => item.getTitle());
}
