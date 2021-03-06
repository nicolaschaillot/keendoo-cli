const fs = require('fs-extra');
const mustache = require('mustache');
const path = require('path');
const chalk = require('chalk');

const d1 = chalk.hex('11b287');
const d2 = chalk.hex('1bf7bc');
const d3 = chalk.hex('9cd4e2');
const layoutTemplate = 'templates/layouts-templates/keendoo-document-section-layout-template.html';

class LayoutResolver {

  constructor(tabObject, docType) {
    this.tabObject = tabObject;
    this.docType = docType;
    // TODO : export to destination folder
    this.baseProject = path.join(process.cwd(), 'results');
    this.checkDirectories();
  }

  get layoutTemplateFile() {
    return fs.readFileSync(layoutTemplate, 'utf8');
  }

  get docTypeToLower() {
    return this.docType.toLowerCase();
  }

  get htmlFileName() {
    return path.join(this.baseProject, 'document', this.docTypeToLower, `${this.layoutName}.html`);
  }

  get layoutDocumentDirectory() {
    return path.join(this.baseProject, 'document', this.docTypeToLower);
  }

  get rootLayoutDocumentDirectory() {
    return path.join(this.baseProject, 'document');
  }

  get layoutName() {
    return `keendoo-${this.docTypeToLower}-${this.tabIdToLower}-view-layout`;
  }

  get templateData() {
    return {
      creationDate: new Date(),
      layoutname: this.layoutName,
      templatecontent: 'foo content'
    };
  }

  get tabIdToLower() {
    return this.tabObject.tab.$.id.toLowerCase();
  }

  checkDirectories() {
    // Ensures that the root document type directory exists
    fs.ensureDirSync(this.rootLayoutDocumentDirectory);
    // Ensures that the document type directory exists
    fs.ensureDirSync(this.layoutDocumentDirectory);
  }

  process() {
    const startMess = `∞ Adding WebUI Sections for document type "${this.docType}" from tab id "${this.tabObject.tab.$.id}"`;
    console.log(d3(startMess));

    // Write new html component in destination directory
    fs.removeSync(this.htmlFileName);
    fs.writeFileSync(this.htmlFileName, this.renderHtml());

    console.log(`${d1('∞∞∞∞∞')} ${d2(this.docType)} ${d1('Done')}`);
  }

  renderHtml() {
    return mustache.to_html(this.layoutTemplateFile, this.templateData);
  }

}

module.exports = LayoutResolver;
