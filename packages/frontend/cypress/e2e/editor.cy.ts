/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('/');
});

describe('Editor', () => {
  it('shows the Editor component', () => {
    cy.get('.Editor').should('be.visible');
  });

  it('shows the preview placeholder', () => {
    cy.get('.preview-placeholder').should('be.visible');
  });

  it('shows setting popup toggle button', () => {
    cy.get('.SettingsPopup').should('be.visible');
  });

  it('shows popup menu when toggle button is clicked', () => {
    cy.get('.SettingsPopup > button').click();
    cy.get('.popup').should('be.visible');
  });

  it('should be able to use the textarea to type the code', () => {
    cy.get('.editor-input').type("console.log('foo');");
  });
});

describe('Autocomplete', () => {
  it('shows autocomplete menu when dropdown is clicked', () => {
    cy.get('.Options .input').first().click();
    cy.get('.candidates li').should('have.length.gt', 1);
  });

  it('should be able to select one of the option', () => {
    cy.get('.Options .input').first().should('have.attr', 'placeholder', 'github dark dimmed').click();
    cy.get('.candidates > li').first().click();
    cy.get('.Options .input').first().should('have.attr', 'placeholder', 'css variables');
  });

  it('should be able to select one of the suggested option', () => {
    cy.get('.Options .input').first().should('have.attr', 'placeholder', 'github dark dimmed').click().type('github');
    cy.get('.candidates li').last().click();
    cy.get('.Options .input').first().should('have.attr', 'placeholder', 'github light');
  });

  it('shows suggestions when some text is inserted', () => {
    const incompleteTexts = [
      // theme
      'github',
      // language
      'script',
      // font family
      'mono',
      // output format
      'png',
    ];

    // desktop
    cy.viewport('macbook-13');
    for (const [index, text] of incompleteTexts.entries()) {
      const input = cy.get('.Options .input').eq(index);
      input.focus().type(text);
      cy.get('.candidates li')
        .should('have.length.at.least', 1)
        .each(($li) => cy.wrap($li).contains(text));
      input.blur();
    }

    // mobile
    cy.viewport('iphone-xr');
    cy.get('.SettingsPopup > button').click();
    for (const [index, text] of incompleteTexts.entries()) {
      const input = cy.get('.Options .input').eq(index);
      input.focus().type(text);
      cy.get('.candidates li')
        .should('have.length.at.least', 1)
        .each(($li) => cy.wrap($li).contains(text));
      input.blur();
    }
  });

  it('should not show any suggestion on garbled input', () => {
    cy.get('.Options .input').first().type('alksjdlaksjdlkajsdlkaj');
    cy.get('.candidate li').should('have.length.lt', 1);
  });
});

describe('Responsive Dropdown', () => {
  type Screen = { width: number; height: number; optionAmount: number };

  it('shows different amount of dropdown inputs based on screen size', () => {
    const screens: Screen[] = [
      // desktop 1080p / FHD screen
      { width: 1920, height: 1080, optionAmount: 4 },
      // desktop 768p / HD screen
      { width: 1366, height: 768, optionAmount: 4 },
      // large screen
      { width: 1100, height: 720, optionAmount: 3 },
      // medium screen
      { width: 1000, height: 720, optionAmount: 2 },
      // small screen
      { width: 800, height: 600, optionAmount: 1 },
      // extra small screen
      { width: 600, height: 400, optionAmount: 0 },
    ];

    for (const screen of screens) {
      cy.viewport(screen.width, screen.height);
      cy.get('.Options').should('have.length', screen.optionAmount);
    }
  });

  it('shows different amount of dropdown inside the popup menu based on screen size', () => {
    const screens: Screen[] = [
      // desktop 1080p / FHD screen
      { width: 1920, height: 1080, optionAmount: 0 },
      // desktop 768p / HD screen
      { width: 1366, height: 768, optionAmount: 0 },
      // large screen
      { width: 1100, height: 720, optionAmount: 1 },
      // medium screen
      { width: 1000, height: 720, optionAmount: 2 },
      // small screen
      { width: 800, height: 600, optionAmount: 3 },
      // extra small screen
      { width: 600, height: 400, optionAmount: 4 },
    ];

    cy.get('.SettingsPopup > button').click();
    for (const screen of screens) {
      cy.viewport(screen.width, screen.height);
      cy.get('.popup > .Options').should('have.length', screen.optionAmount);
    }
  });
});

describe('Popup menu', () => {
  it('should be able to select upscale option', () => {
    cy.get('.SettingsPopup > button').click();
    const upscaleItem = cy.get('.upscale > .upscale-item').last();
    upscaleItem.last().should('have.css', 'opacity', '0.5');
    upscaleItem.last().click();
    upscaleItem.last().should('have.css', 'opacity', '1');
  });

  it('should be able to input border thickness and radius', () => {
    cy.get('.SettingsPopup > button').click();
    cy.get('.border-input').each(($input) => {
      cy.wrap($input).type('12');
    });
  });
});
