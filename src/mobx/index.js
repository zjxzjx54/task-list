import CurrentStore from "./CurrentStore";
import FinishStore from "./FinishStore";
import FutureStore from "./FutureStore";
import UserStore from "./UserStore";
import TimeoutStore from "./TimeoutStore";



const rootStore =  {
    currentStore : new CurrentStore(),
    finishStore : new FinishStore(),
    futureStore : new FutureStore(),
    timeoutStore : new TimeoutStore(),
    userStore : new UserStore(),
}

export default rootStore
