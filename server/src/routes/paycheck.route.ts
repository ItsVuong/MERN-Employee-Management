import PaycheckController from "../controllers/paycheck.controller";
import authenticate from "../middlewares/auth.middleware";

const PaycheckRoute = [
  {
    method: "post",
    route: "/paycheck/create",
    controller: PaycheckController.createPaycheck,
    validation: [
      authenticate(),
    ]
  },
  {
    method: "get",
    route: "/paycheck",
    controller: PaycheckController.getPaycheckByUser,
    validation:[
      authenticate()
    ]
  },
  {
    method: "put",
    route: "/paycheck/update/:id",
    controller: PaycheckController.updatePaycheckByUser,
    validation:[]
  }
]

export default PaycheckRoute
