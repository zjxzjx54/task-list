import CurrentStore from "./CurrentStore";
import FinishStore from "./FinishStore";
import FutureStore from "./FutureStore";
import UserStore from "./UserStore";



const rootStore =  {
    currentStore : new CurrentStore(),
    finishStore : new FinishStore(),
    futureStore : new FutureStore(),
    userStore : new UserStore(),
}

export default rootStore
