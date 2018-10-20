const fs = require('fs-extra');
const mustache = require('mustache');
const path = require('path');

const layoutTemplate = 'templates/layouts-templates/keendoo-document-section-layout-template.html';

class LayoutResolver {

  constructor(tabObject, docType) {
    this.tabObject = tabObject;
    this.docType = docType;
    // TODO : export to destination folder
    this.baseProject = path.join(process.cwd(), 'results');
  }

  get layoutTemplateFile() {
    return fs.readFileSync(layoutTemplate, 'utf8');
  }

  get templateData() {
    return {
      creationDate: new Date(),
      layoutname: `keendoo-${this.docType}-${this.tabObject.tab.$.id.toLowerCase()}-view-layout`,
    };
  }

  get htmlFileName() {
    return path.join(this.baseProject, `keendoo-${this.docType}-${this.tabObject.tab.$.id.toLowerCase()}-view-layout.html`);
  }

  renderHtml() {
    return mustache.to_html(this.layoutTemplateFile, this.templateData);
  }

}

module.exports = LayoutResolver;
