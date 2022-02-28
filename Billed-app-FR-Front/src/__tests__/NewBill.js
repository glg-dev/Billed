/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event"
import router from "../app/Router.js";
import Store from "../app/Store";

jest.mock("../app/store", () => mockStore)

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({pathname});
};


describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        type: 'Employee'
      })
    )
    Object.defineProperty(window, 'location', {
      value: {
        hash: ROUTES_PATH['NewBill']
      }
    })
  })

  describe('When I submit a new Bill on correct format', () => { 
    test('Then the submit should success', () => { 
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill1 = new NewBill({
        document, onNavigate, localStorage: window.localStorage
      });
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeTruthy()
      const handleSubmit = jest.fn((e) => newBill1.handleSubmit(e))
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();      
    })
   })

  describe("When I upload an incorrect file", () => {
    test("Then the upload fail", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const file = screen.getByTestId("file")
      const newBill = new NewBill({
        document,
        onNavigate,
        store: Store,
        localStorage: window.localStorage
      })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, {
        target: {
            files: [new File(["image"], "test.pdf", {type: "image/pdf"})]
        }
      })
      expect(file.value).toBe('')
    })
  })
})
