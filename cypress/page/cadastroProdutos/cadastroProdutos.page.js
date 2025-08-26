import { cadastroProdutosElements } from './cadastroProdutos.elements'
import { fakerPT_BR as faker } from '@faker-js/faker'

const usedProductNames = new Set()

class registerNewProducts {
  accessProductRegistrationScreen() {
    cy.get(cadastroProdutosElements.navBar).should('be.visible')
    cy.get(cadastroProdutosElements.registerProductButton)
      .should('be.visible')
      .click()
    cy.get(cadastroProdutosElements.registerProductCard).should('be.visible')
  }

  acessStockInformationScreen() {
    cy.get(cadastroProdutosElements.stockInformationButton)
      .should('be.visible')
      .click()
  }

  selectProductRegistrationType(registerType) {
    if (registerType) {
      cy.get(cadastroProdutosElements.registerType)
        .should('be.visible')
        .select(registerType)
    } else {
      cy.get(cadastroProdutosElements.submitButton).click()
      cy.get(cadastroProdutosElements.productName).should('not.be.visible')
      cy.get(cadastroProdutosElements.existingName).should('not.be.visible')
    }
  }

  getUniqueProductName() {
    let name
    do {
      name = faker.commerce.product()
    } while (usedProductNames.has(name))
    usedProductNames.add(name)
    return name
  }

  generateProductData() {
    return {
      productName: this.getUniqueProductName(),
      description: 'Descrição teste do produto',
      productQuantity: faker.number.int({ min: 1, max: 300 }),
      acquisitionPrice: faker.commerce.price({ min: 15, max: 350 }),
      salePrice: faker.commerce.price({ min: 20, max: 530 }),
      supplier: faker.person.fullName(),
      quantityProductAdd: faker.number.int({ min: 1, max: 50 }),
    }
  }

  registerNewProduct(
    fillProductName,
    fillDescription,
    fillProductQuantity,
    fillAcquisitionPrice,
    fillSalePrice,
    fillSupplier,
  ) {
    cy.get(cadastroProdutosElements.productName).should('be.visible')

    const data = this.generateProductData()

    if (fillProductName) {
      cy.get(cadastroProdutosElements.productName).type(data.productName)
    }

    if (fillDescription) {
      cy.get(cadastroProdutosElements.productDescription).type(data.description)
    }

    if (fillProductQuantity) {
      cy.get(cadastroProdutosElements.productQuantity).type(
        data.productQuantity,
      )
    }

    if (fillAcquisitionPrice) {
      cy.get(cadastroProdutosElements.acquisitionPrice).type(
        data.acquisitionPrice,
      )
    }

    if (fillSalePrice) {
      cy.get(cadastroProdutosElements.salePrice).type(`${data.salePrice}`)
    }

    if (fillSupplier) {
      cy.get(cadastroProdutosElements.supplier).type(data.supplier)
    }

    cy.get(cadastroProdutosElements.submitButton).should('be.visible').click()

    return {
      productName: fillProductName ? data.productName : null,
      description: fillDescription ? data.description : null,
      productQuantity: fillProductQuantity ? data.productQuantity : null,
      acquisitionPrice: fillAcquisitionPrice ? data.acquisitionPrice : null,
      salePrice: fillSalePrice ? data.salePrice : null,
      supplier: fillSupplier ? data.supplier : null,
    }
  }

  validateProductRegistration(successMessage, productData, status, alert) {
    if (status === 'success') {
      cy.get(cadastroProdutosElements.alert)
        .should('be.visible')
        .should('contain', successMessage)

      cy.get(cadastroProdutosElements.productTable)
        .should('be.visible')
        .find('tbody')
        .within(() => {
          if (productData.productName)
            cy.contains(productData.productName).should('be.visible')
        })
    } else {
      cy.get(cadastroProdutosElements.alert)
        .should('be.visible')
        .should('contain', alert)
      cy.get(cadastroProdutosElements.registerType).should('be.visible')
      this.acessStockInformationScreen()
      cy.get(cadastroProdutosElements.productTable)
        .should('be.visible')
        .find('tbody')
        .within(() => {
          cy.get(productData.productName).should('not.exist')
        })
    }
  }

  getExistingProductQuantity() {
    cy.get(cadastroProdutosElements.productTable)
      .should('be.visible')
      .find('tbody tr')
      .last()
      .within(() => {
        cy.get('td')
          .eq(5)
          .invoke('text')
          .then((text) => {
            const existingquantity = parseInt(text.trim(), 10)
            cy.wrap(existingquantity).as('existingQuantity')
          })
      })
  }

  getExistingProductName() {
    cy.get(cadastroProdutosElements.productTable)
      .should('be.visible')
      .find('tbody tr')
      .last()
      .within(() => {
        cy.get('td')
          .eq(1)
          .invoke('text')
          .then((text) => {
            cy.wrap(text).as('existingProductName')
          })
      })
  }

  registerExistingProduct(existingProductName, fillQuantityToAdd) {
    cy.get(cadastroProdutosElements.existingName).should('be.visible')
    const data = this.generateProductData()
    if (existingProductName) {
      cy.get('@existingProductName').then((existingProductName) => {
        cy.get(cadastroProdutosElements.existingName).type(existingProductName)
      })
    }
    if (fillQuantityToAdd) {
      cy.get(cadastroProdutosElements.quantityProductAdd).type(
        data.quantityProductAdd,
      )
      cy.wrap(data.quantityProductAdd).as('quantityProductAdd')
    }
    cy.get(cadastroProdutosElements.submitButton).should('be.visible').click()
    return {
      quantityProductAdd: fillQuantityToAdd ? data.quantityProductAdd : null,
    }
  }

  validateExitingProductRegistration(status, alert) {
    if (status === 'success') {
      cy.get(cadastroProdutosElements.alert)
        .should('be.visible')
        .should('contain', alert)

      cy.get('@existingProductName').then((existingProductName) => {
        cy.get('@existingQuantity').then((existingQuantity) => {
          cy.get('@quantityProductAdd').then((quantityProductAdd) => {
            const newQuantity =
              Number(existingQuantity) + Number(quantityProductAdd)
            cy.get(cadastroProdutosElements.productTable)
              .find('tbody tr:last')
              .within(() => {
                cy.get('td').eq(1).should('contain', existingProductName)
                cy.get('td').eq(5).should('contain', newQuantity)
              })
          })
        })
      })
    } else {
      cy.get(cadastroProdutosElements.alert)
        .should('be.visible')
        .should('contain', alert)
      cy.get(cadastroProdutosElements.registerType).should('be.visible')
      this.acessStockInformationScreen()
      cy.get(cadastroProdutosElements.productTable)
        .find('tbody tr:last')
        .within(() => {
          cy.get('@existingProductName').then((existingProductName) => {
            cy.get('td').eq(1).should('contain', existingProductName)
          })
          cy.get('@existingQuantity').then((existingQuantity) => {
            cy.get('td').eq(5).should('contain', existingQuantity)
          })
        })
    }
  }
}
export default new registerNewProducts()
