// https://www.jvandemo.com/how-to-use-environment-variables-to-configure-your-angular-application-without-a-rebuild/
(function (window) {
  window.__env = window.__env || {};

  // environment-dependent settings
  window.__env.apiUrl = 'http://localhost:5064/api/';
  window.__env.version = '0.1.1';
  // enable thesaurus import in thesaurus list for admins
  window.__env.thesImportEnabled = true;
  // history
  window.__env.historyEnabled = true;

  // help
  window.__env.helpUrlTemplate = [
    'https://vedph.github.io/cadmus-help[-{language}]/parts/{typeId}{separator}{roleId}{separator}{frRoleId}.html',
  ];
  // set to false to skip checking page availability (e.g. when CORS is not allowed)
  window.__env.helpUrlCheck = true;

  // Zotero
  window.__env.zoteroApiKey = 'TODO:YOUR_ZOTERO_KEY';
  window.__env.zoteroUserId = 'TODO:YOUR_ZOTERO_USER_ID';
  window.__env.zoteroLibraryId = 'TODO:YOUR_ZOTERO_LIBRARY_ID';
  // UI branding: staging, dev, production (default)
  window.__env.branding = 'production';
  // proxy
  window.__env.proxyUrl = 'http://localhost:5064/api/proxy';
})(this);
