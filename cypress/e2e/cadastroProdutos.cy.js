import registerProducts from '../page/cadastroProdutos/cadastroProdutos.page'
import loginPage from '../page/login/login.page'
describe('Cadastro de Produto', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('login.json').then((data) => {
      const { username, password } = data.loginMaster
      loginPage.loginSystem(username, password)
      loginPage.goToHomePage()
    })
  })

  it('Cadastro de produto não selecionando um tipo de cadastro', () => {
    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { none } = data.registerType
      registerProducts.selectProductRegistrationType(none)
    })
  })

  it('Cadastrar de novo produto com sucesso', () => {
    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { newProduct } = data.registerType
      const { success } = data.registerStatus
      const flags = data.successfulRegistration

      registerProducts.selectProductRegistrationType(newProduct)

      const productData = registerProducts.registerNewProduct(
        flags.productName,
        flags.description,
        flags.productQuantity,
        flags.acquisitionPrice,
        flags.salePrice,
        flags.supplier,
      )

      cy.fixture('alerts.json').then((data) => {
        const { successfulRegistration } = data.alerts
        registerProducts.validateProductRegistration(
          successfulRegistration,
          productData,
          success,
        )
      })
    })
  })

  it('Cadastro de novo produto sem preenchimento dos campos', () => {
    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { newProduct } = data.registerType
      const flags = data.newProductNoFieldsFilled
      const { failure } = data.registerStatus

      registerProducts.selectProductRegistrationType(newProduct)

      const productData = registerProducts.registerNewProduct(
        flags.productName,
        flags.description,
        flags.productQuantity,
        flags.acquisitionPrice,
        flags.salePrice,
        flags.supplier,
      )

      cy.fixture('alerts.json').then((data) => {
        const { requiredFields, newProductRegistrationFailure } = data.alerts
        registerProducts.validateProductRegistration(
          requiredFields,
          productData,
          failure,
          newProductRegistrationFailure,
        )
      })
    })
  })

  it('Cadastro de novo produto com apenas campos obrigatórios preenchidos', () => {
    registerProducts.accessProductRegistrationScreen()
    cy.fixture('cadastroProdutos.json').then((data) => {
      const { newProduct } = data.registerType
      const flags = data.onlyRequiredFields
      const { success } = data.registerStatus

      registerProducts.selectProductRegistrationType(newProduct)

      const productData = registerProducts.registerNewProduct(
        flags.productName,
        flags.description,
        flags.productQuantity,
        flags.acquisitionPrice,
        flags.salePrice,
        flags.supplier,
      )

      cy.fixture('alerts.json').then((data) => {
        const { successfulRegistration } = data.alerts
        registerProducts.validateProductRegistration(
          successfulRegistration,
          productData,
          success,
        )
      })
    })
  })

  it('Cadastro de novo produto com apenas campos não obrigatórios preenchidos', () => {
    registerProducts.accessProductRegistrationScreen()
    cy.fixture('cadastroProdutos.json').then((data) => {
      const { newProduct } = data.registerType
      const flags = data.onlyNonRequiredFields
      const { failure } = data.registerStatus

      registerProducts.selectProductRegistrationType(newProduct)

      const productData = registerProducts.registerNewProduct(
        flags.productName,
        flags.description,
        flags.productQuantity,
        flags.acquisitionPrice,
        flags.salePrice,
        flags.supplier,
      )

      cy.fixture('alerts.json').then((data) => {
        const { successfulRegistration, newProductRegistrationFailure } =
          data.alerts
        registerProducts.validateProductRegistration(
          successfulRegistration,
          productData,
          failure,
          newProductRegistrationFailure,
        )
      })
    })
  })

  it('Cadastro de produto existente com sucesso', () => {
    registerProducts.getExistingProductName()

    registerProducts.getExistingProductQuantity()

    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { existingProduct } = data.registerType
      const flags = data.succesfulExistingProductRegistration
      const { success } = data.registerStatus

      registerProducts.selectProductRegistrationType(existingProduct)
      registerProducts.registerExistingProduct(
        flags.existingProductName,
        flags.quantityToAdd,
      )

      cy.fixture('alerts.json').then((data) => {
        const { successfulStockUpdate } = data.alerts
        registerProducts.validateExitingProductRegistration(
          success,
          successfulStockUpdate,
        )
      })
    })
  })

  it('Cadastro de produto existente sem preenchimento dos campos', () => {
    registerProducts.getExistingProductName()

    registerProducts.getExistingProductQuantity()

    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { existingProduct } = data.registerType
      const flags = data.existingProductNoFieldsFilled
      const { failure } = data.registerStatus

      registerProducts.selectProductRegistrationType(existingProduct)
      registerProducts.registerExistingProduct(
        flags.existingProductName,
        flags.quantityToAdd,
      )

      cy.fixture('alerts.json').then((data) => {
        const { existentProductRegistrationFailure } = data.alerts
        registerProducts.validateExitingProductRegistration(
          failure,
          existentProductRegistrationFailure,
        )
      })
    })
  })

  it('Cadastro de produto existente com apenas campo "nome" preenchido', () => {
    registerProducts.getExistingProductName()

    registerProducts.getExistingProductQuantity()

    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { existingProduct } = data.registerType
      const flags = data.onlyProductNameFilled
      const { failure } = data.registerStatus

      registerProducts.selectProductRegistrationType(existingProduct)
      registerProducts.registerExistingProduct(
        flags.existingProductName,
        flags.quantityToAdd,
      )

      cy.fixture('alerts.json').then((data) => {
        const { existentProductRegistrationFailure } = data.alerts
        registerProducts.validateExitingProductRegistration(
          failure,
          existentProductRegistrationFailure,
        )
      })
    })
  })

  it('Cadastro de produto existente com apenas campo "quantidade a adicionar" preenchido', () => {
    registerProducts.getExistingProductName()

    registerProducts.getExistingProductQuantity()

    registerProducts.accessProductRegistrationScreen()

    cy.fixture('cadastroProdutos.json').then((data) => {
      const { existingProduct } = data.registerType
      const flags = data.onlyQuantityToAddFilled
      const { failure } = data.registerStatus

      registerProducts.selectProductRegistrationType(existingProduct)
      registerProducts.registerExistingProduct(
        flags.existingProductName,
        flags.quantityToAdd,
      )

      cy.fixture('alerts.json').then((data) => {
        const { existentProductRegistrationFailure } = data.alerts
        registerProducts.validateExitingProductRegistration(
          failure,
          existentProductRegistrationFailure,
        )
      })
    })
  })
})
